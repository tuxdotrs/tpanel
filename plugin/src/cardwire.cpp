#include "cardwire.hpp"

#include <qdbusargument.h>
#include <qdbusconnection.h>
#include <qdbusextratypes.h>
#include <qdbusmessage.h>
#include <qdbusmetatype.h>
#include <qdbuspendingcall.h>
#include <qdbusservicewatcher.h>
#include <qloggingcategory.h>
#include <qqmlengine.h>
#include <qvariant.h>

// a{oa{sa{sv}}} as returned by GetManagedObjects
using InterfacesMap = QMap<QString, QVariantMap>;
using ManagedObjects = QMap<QDBusObjectPath, InterfacesMap>;

Q_DECLARE_METATYPE(InterfacesMap)
Q_DECLARE_METATYPE(ManagedObjects)

namespace {

Q_LOGGING_CATEGORY(logCardwire, "tshell.cardwire", QtWarningMsg);

const QString SERVICE = "org.opengamingcollective.cardwire";
const QString ROOT_PATH = "/org/opengamingcollective/cardwire";
const QString GPU_PREFIX = "/org/opengamingcollective/cardwire/Gpu/";
const QString GPU_IFACE = "org.opengamingcollective.cardwire.Gpu";
const QString PROPS_IFACE = "org.freedesktop.DBus.Properties";
const QString OBJMGR_IFACE = "org.freedesktop.DBus.ObjectManager";

void registerMetaTypes() {
  qDBusRegisterMetaType<InterfacesMap>();
  qDBusRegisterMetaType<ManagedObjects>();
}

QDBusMessage methodCall(const QString &path, const QString &iface,
                        const QString &member) {
  return QDBusMessage::createMethodCall(SERVICE, path, iface, member);
}

QDBusPendingCallWatcher *asyncCall(QObject *parent,
                                   const QDBusMessage &message) {
  return new QDBusPendingCallWatcher(
      QDBusConnection::systemBus().asyncCall(message), parent);
}

void logError(const QString &what, const QDBusMessage &reply) {
  if (reply.type() == QDBusMessage::ErrorMessage) {
    qCWarning(logCardwire).nospace()
        << what << ": " << reply.errorName() << " " << reply.errorMessage();
  }
}

} // namespace

CardwireGpu::CardwireGpu(QString objectPath, QObject *parent)
    : QObject(parent), mObjectPath(std::move(objectPath)) {
  auto bus = QDBusConnection::systemBus();
  bus.connect(SERVICE, this->mObjectPath, PROPS_IFACE, "PropertiesChanged",
              this, SLOT(onPropertiesChanged(QDBusMessage)));
  bus.connect(SERVICE, this->mObjectPath, GPU_IFACE, "PowerStateChanged", this,
              SLOT(onPowerStateChanged(QString)));

  this->refreshDevice();
  this->refreshProperties();
}

void CardwireGpu::refreshDevice() {
  QObject::connect(
      asyncCall(this, methodCall(this->mObjectPath, GPU_IFACE, "GetDevice")),
      &QDBusPendingCallWatcher::finished, this,
      &CardwireGpu::onGetDeviceFinished);
}

void CardwireGpu::onGetDeviceFinished() {
  auto *watcher = qobject_cast<QDBusPendingCallWatcher *>(this->sender());
  if (watcher == nullptr)
    return;
  watcher->deleteLater();

  const QDBusMessage reply = watcher->reply();
  logError("GetDevice failed for " + this->mObjectPath, reply);
  if (reply.type() == QDBusMessage::ErrorMessage)
    return;

  // (ssuubbbbssbs): name pci render card default discrete virtual available
  // vendor driver nvidia nvidia_minor
  QString pci;
  QString vendor;
  QString driver;
  QString nvidiaMinor;
  uint render = 0;
  uint card = 0;
  bool virtualGpu = false;

  const auto arguments = reply.arguments();
  if (arguments.first().userType() != qMetaTypeId<QDBusArgument>()) {
    // The daemon actually sends the fields as separate out arguments.
    if (arguments.size() < 12) {
      qCWarning(logCardwire)
          << "GetDevice returned" << arguments.size() << "arguments";
      return;
    }
    this->mName = arguments.at(0).toString();
    pci = arguments.at(1).toString();
    render = arguments.at(2).toUInt();
    card = arguments.at(3).toUInt();
    this->mDefault = arguments.at(4).toBool();
    this->mDiscrete = arguments.at(5).toBool();
    virtualGpu = arguments.at(6).toBool();
    this->mAvailable = arguments.at(7).toBool();
    vendor = arguments.at(8).toString();
    driver = arguments.at(9).toString();
    this->mNvidia = arguments.at(10).toBool();
    nvidiaMinor = arguments.at(11).toString();
  } else {
    // Documented shape: all fields packed into a single struct.
    // Must be const: demarshalling uses the const (read) overloads.
    const QDBusArgument arg = arguments.first().value<QDBusArgument>();
    arg.beginStructure();
    arg >> this->mName >> pci >> render >> card >> this->mDefault >>
        this->mDiscrete >> virtualGpu >> this->mAvailable >> vendor >> driver >>
        this->mNvidia >> nvidiaMinor;
    arg.endStructure();
  }

  if (!this->mKnown) {
    this->mKnown = true;
    qCInfo(logCardwire).nospace() << "found gpu \"" << this->mName << "\" at "
                                  << this->mObjectPath << " (" << pci << ")";
  }

  emit this->deviceChanged();
}

void CardwireGpu::refreshProperties() {
  QDBusMessage call = methodCall(this->mObjectPath, PROPS_IFACE, "GetAll");
  call << GPU_IFACE;

  QObject::connect(asyncCall(this, call), &QDBusPendingCallWatcher::finished,
                   this, &CardwireGpu::onGetAllFinished);
}

void CardwireGpu::onGetAllFinished() {
  auto *watcher = qobject_cast<QDBusPendingCallWatcher *>(this->sender());
  if (watcher == nullptr)
    return;
  watcher->deleteLater();

  const QDBusMessage reply = watcher->reply();
  logError("GetAll failed for " + this->mObjectPath, reply);
  if (reply.type() == QDBusMessage::ErrorMessage)
    return;

  const auto properties = qdbus_cast<QVariantMap>(reply.arguments().at(0));
  for (auto it = properties.constBegin(); it != properties.constEnd(); ++it) {
    if (it.key() == "Block")
      this->setBlockedValue(it.value().toBool());
    else if (it.key() == "Launchable")
      this->setLaunchableValue(it.value().toBool());
  }
}

void CardwireGpu::setBlocked(bool blocked) {
  QDBusMessage call = methodCall(this->mObjectPath, PROPS_IFACE, "Set");
  call << GPU_IFACE << QStringLiteral("Block")
       << QVariant::fromValue(QDBusVariant(blocked));

  // The resulting state is confirmed asynchronously via PropertiesChanged.
  asyncCall(this, call);
}

void CardwireGpu::onPropertiesChanged(const QDBusMessage &message) {
  const auto arguments = message.arguments();
  if (arguments.isEmpty() || arguments.first().toString() != GPU_IFACE)
    return;

  if (arguments.size() > 1) {
    const auto properties = qdbus_cast<QVariantMap>(arguments.at(1));
    for (auto it = properties.constBegin(); it != properties.constEnd(); ++it) {
      if (it.key() == "Block")
        this->setBlockedValue(it.value().toBool());
      else if (it.key() == "Launchable")
        this->setLaunchableValue(it.value().toBool());
    }
  }

  if (arguments.size() > 2) { // invalidated properties: refetch everything
    const auto invalidated = qdbus_cast<QStringList>(arguments.at(2));
    if (invalidated.contains("Block") || invalidated.contains("Launchable")) {
      this->refreshProperties();
    }
  }
}

void CardwireGpu::onPowerStateChanged(const QString &state) {
  emit this->powerStateChanged(state);
}

void CardwireGpu::setBlockedValue(bool blocked) {
  if (blocked == this->mBlocked)
    return;
  this->mBlocked = blocked;
  qCDebug(logCardwire).nospace()
      << this->mObjectPath << ": block = " << blocked;
  emit this->blockedChanged();
}

void CardwireGpu::setLaunchableValue(bool launchable) {
  if (launchable == this->mLaunchable)
    return;
  this->mLaunchable = launchable;
  emit this->launchableChanged();
}

Cardwire::Cardwire(QObject *parent) : QObject(parent), mWatcher(this) {}

Cardwire *Cardwire::instance() {
  static Cardwire *instance =
      nullptr; // NOLINT(cppcoreguidelines-avoid-non-const-global-variables)
  if (instance == nullptr) {
    registerMetaTypes();
    instance = new Cardwire();
    instance->connectSignals();
  }
  return instance;
}

Cardwire *Cardwire::create(QQmlEngine * /*qmlEngine*/,
                           QJSEngine * /*jsEngine*/) {
  auto *instance = Cardwire::instance();
  QQmlEngine::setObjectOwnership(instance, QQmlEngine::CppOwnership);
  return instance;
}

CardwireGpu *Cardwire::nvidiaGpu() const {
  for (auto *gpu : this->mGpus) {
    if (gpu->isNvidia())
      return gpu;
  }
  return nullptr;
}

void Cardwire::connectSignals() {
  // cardwired runs as a system service, so its API is on the system bus.
  this->mWatcher.setConnection(QDBusConnection::systemBus());
  QObject::connect(&this->mWatcher, &QDBusServiceWatcher::serviceOwnerChanged,
                   this, &Cardwire::onServiceOwnerChanged);
  this->mWatcher.setWatchMode(QDBusServiceWatcher::WatchForOwnerChange);

  auto bus = QDBusConnection::systemBus();
  bus.connect(SERVICE, ROOT_PATH, OBJMGR_IFACE, "InterfacesAdded", this,
              SLOT(onInterfacesAdded(QDBusMessage)));
  bus.connect(SERVICE, ROOT_PATH, OBJMGR_IFACE, "InterfacesRemoved", this,
              SLOT(onInterfacesRemoved(QDBusMessage)));

  // Kick off the initial sync; if the daemon is not running yet the service
  // watcher triggers another sync once it appears.
  this->sync();
}

void Cardwire::onServiceOwnerChanged(const QString &serviceName,
                                     const QString &oldOwner,
                                     const QString &newOwner) {
  if (serviceName != SERVICE)
    return;
  qCInfo(logCardwire).nospace()
      << SERVICE << " owner: " << oldOwner << " -> " << newOwner;

  this->sync();
}

void Cardwire::sync() {
  const auto generation = ++this->mGeneration;
  auto *watcher =
      asyncCall(this, methodCall(ROOT_PATH, OBJMGR_IFACE, "GetManagedObjects"));
  QObject::connect(watcher, &QDBusPendingCallWatcher::finished, this,
                   [this, generation]() { this->handleSyncReply(generation); });
}

void Cardwire::handleSyncReply(quint32 generation) {
  auto *watcher = qobject_cast<QDBusPendingCallWatcher *>(this->sender());
  if (watcher == nullptr)
    return;
  watcher->deleteLater();

  if (generation != this->mGeneration)
    return; // a newer sync superseded this one

  const QDBusMessage reply = watcher->reply();
  logError("GetManagedObjects failed", reply);
  if (reply.type() == QDBusMessage::ErrorMessage) {
    if (this->mConnected) {
      this->mConnected = false;
      emit this->connectedChanged();
    }

    for (auto *gpu : this->mGpus)
      gpu->deleteLater();
    if (!this->mGpus.isEmpty()) {
      this->mGpus.clear();
      emit this->gpusChanged();
    }
    return;
  }

  QList<CardwireGpu *> seen;
  const auto objects = qdbus_cast<ManagedObjects>(reply.arguments().at(0));
  for (auto it = objects.constBegin(); it != objects.constEnd(); ++it) {
    if (!it.value().contains(GPU_IFACE))
      continue;

    const QString &path = it.key().path();
    if (!path.startsWith(GPU_PREFIX))
      continue;

    this->ensureGpu(path);
    seen.append(this->findGpu(path));
  }

  // Remove GPUs that disappeared (hotplug).
  for (auto *gpu : this->mGpus) {
    if (!seen.contains(gpu))
      gpu->deleteLater();
  }

  if (seen != this->mGpus) {
    this->mGpus = seen;
    emit this->gpusChanged();
  }

  if (!this->mConnected) {
    this->mConnected = true;
    qCInfo(logCardwire) << "connected to" << SERVICE;
    emit this->connectedChanged();
  }
}

void Cardwire::ensureGpu(const QString &path) {
  if (this->findGpu(path) != nullptr)
    return;

  auto *gpu = new CardwireGpu(path, this);
  // The nvidia flag only becomes known once GetDevice replies.
  QObject::connect(gpu, &CardwireGpu::deviceChanged, this,
                   &Cardwire::updateNvidiaGpu);
  this->mGpus.append(gpu);
  qCInfo(logCardwire) << "tracking" << path;
  emit this->gpusChanged();
}

CardwireGpu *Cardwire::findGpu(const QString &path) const {
  for (auto *gpu : this->mGpus) {
    if (gpu->objectPath() == path)
      return gpu;
  }
  return nullptr;
}

void Cardwire::removeGpu(const QString &path) {
  auto *gpu = this->findGpu(path);
  if (gpu == nullptr)
    return;

  gpu->deleteLater();
  this->mGpus.removeOne(gpu);
  qCInfo(logCardwire) << "stopped tracking" << path;
  emit this->gpusChanged();
}

void Cardwire::onInterfacesAdded(const QDBusMessage &message) {
  const auto arguments = message.arguments();
  if (arguments.size() < 2)
    return;

  const auto path = arguments.first().toString();
  if (!path.startsWith(GPU_PREFIX))
    return;

  if (qdbus_cast<InterfacesMap>(arguments.at(1)).contains(GPU_IFACE))
    this->ensureGpu(path);
}

void Cardwire::onInterfacesRemoved(const QDBusMessage &message) {
  const auto arguments = message.arguments();
  if (arguments.size() < 2)
    return;

  const auto path = arguments.first().toString();
  if (!path.startsWith(GPU_PREFIX))
    return;

  if (qdbus_cast<QStringList>(arguments.at(1)).contains(GPU_IFACE))
    this->removeGpu(path);
}

void Cardwire::updateNvidiaGpu() {
  auto *current = this->nvidiaGpu();
  if (current == this->mCurrentNvidiaGpu)
    return;

  this->mCurrentNvidiaGpu = current;
  emit this->nvidiaGpuChanged();
}
