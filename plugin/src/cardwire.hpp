#pragma once

#include <qcontainerfwd.h>
#include <qdbusmessage.h>
#include <qdbusservicewatcher.h>
#include <qlist.h>
#include <qobject.h>
#include <qqmlintegration.h>
#include <qstring.h>

class QDBusPendingCallWatcher;
class QJSEngine;
class QQmlEngine;

/// A single GPU exposed by cardwire at
/// /org/opengamingcollective/cardwire/Gpu/{id}.
///
/// Mirrors org.opengamingcollective.cardwire.Gpu: device details are fetched
/// once via GetDevice, while Block/Launchable are kept in sync through
/// org.freedesktop.DBus.Properties.PropertiesChanged.
class CardwireGpu : public QObject {
  Q_OBJECT
  QML_ELEMENT
  QML_UNCREATABLE("Gpu objects are managed by the Cardwire singleton")

  Q_PROPERTY(QString objectPath READ objectPath CONSTANT)
  Q_PROPERTY(bool known READ known NOTIFY deviceChanged)
  Q_PROPERTY(QString name READ name NOTIFY deviceChanged)
  Q_PROPERTY(bool nvidia READ isNvidia NOTIFY deviceChanged)
  Q_PROPERTY(bool defaultGpu READ isDefault NOTIFY deviceChanged)
  Q_PROPERTY(bool discrete READ isDiscrete NOTIFY deviceChanged)
  Q_PROPERTY(bool available READ isAvailable NOTIFY deviceChanged)
  Q_PROPERTY(bool blocked READ isBlocked NOTIFY blockedChanged)
  Q_PROPERTY(bool launchable READ isLaunchable NOTIFY launchableChanged)

public:
  explicit CardwireGpu(QString objectPath, QObject *parent = nullptr);

  [[nodiscard]] const QString &objectPath() const { return this->mObjectPath; }
  [[nodiscard]] bool known() const { return this->mKnown; }
  [[nodiscard]] const QString &name() const { return this->mName; }
  [[nodiscard]] bool isNvidia() const { return this->mNvidia; }
  [[nodiscard]] bool isDefault() const { return this->mDefault; }
  [[nodiscard]] bool isDiscrete() const { return this->mDiscrete; }
  [[nodiscard]] bool isAvailable() const { return this->mAvailable; }
  [[nodiscard]] bool isBlocked() const { return this->mBlocked; }
  [[nodiscard]] bool isLaunchable() const { return this->mLaunchable; }

  // Writes the Block property. Only succeeds when the daemon mode allows it
  // (the daemon rejects the write otherwise and the state stays unchanged).
  Q_INVOKABLE void setBlocked(bool blocked);

signals:
  void deviceChanged();
  void blockedChanged();
  void launchableChanged();
  void powerStateChanged(const QString &state);

private slots:
  void onPropertiesChanged(const QDBusMessage &message);
  void onPowerStateChanged(const QString &state);
  void onGetDeviceFinished();
  void onGetAllFinished();

private:
  void refreshDevice();
  void refreshProperties();
  void setBlockedValue(bool blocked);
  void setLaunchableValue(bool launchable);

  QString mObjectPath;
  bool mKnown = false;
  QString mName;
  bool mNvidia = false;
  bool mDefault = false;
  bool mDiscrete = false;
  bool mAvailable = false;
  bool mBlocked = false;
  bool mLaunchable = false;
};

/// Exposes the GPUs tracked by the cardwire daemon over D-Bus.
class Cardwire : public QObject {
  Q_OBJECT
  QML_ELEMENT
  QML_SINGLETON

  Q_PROPERTY(bool connected READ isConnected NOTIFY connectedChanged)
  Q_PROPERTY(QList<CardwireGpu *> gpus READ gpus NOTIFY gpusChanged)
  Q_PROPERTY(CardwireGpu *nvidiaGpu READ nvidiaGpu NOTIFY nvidiaGpuChanged)

public:
  static Cardwire *create(QQmlEngine *qmlEngine, QJSEngine *jsEngine);
  static Cardwire *instance();

  [[nodiscard]] bool isConnected() const { return this->mConnected; }
  [[nodiscard]] QList<CardwireGpu *> gpus() const { return this->mGpus; }

  /// The first NVIDIA GPU found by the daemon, or nullptr if there is none.
  [[nodiscard]] CardwireGpu *nvidiaGpu() const;

signals:
  void connectedChanged();
  void gpusChanged();
  void nvidiaGpuChanged();

private slots:
  void onServiceOwnerChanged(const QString &serviceName,
                             const QString &oldOwner, const QString &newOwner);
  void onInterfacesAdded(const QDBusMessage &message);
  void onInterfacesRemoved(const QDBusMessage &message);

private:
  explicit Cardwire(QObject *parent = nullptr);

  void connectSignals();
  void sync();
  void handleSyncReply(quint32 generation);
  void ensureGpu(const QString &path);
  [[nodiscard]] CardwireGpu *findGpu(const QString &path) const;
  void removeGpu(const QString &path);
  void updateNvidiaGpu();

  QDBusServiceWatcher mWatcher;
  QList<CardwireGpu *> mGpus;
  CardwireGpu *mCurrentNvidiaGpu = nullptr;
  bool mConnected = false;
  quint32 mGeneration = 0;
};
