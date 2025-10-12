import {
  For,
  createBinding,
  createComputed,
  createState,
  onCleanup,
} from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import AstalNotifd from "gi://AstalNotifd";
import { Notification } from "./notification";

export const WINDOW_NAME = "notifications";

export const Notifications = (gdkmonitor: Gdk.Monitor) => {
  const notifd = AstalNotifd.get_default();
  const isDndMode = createBinding(notifd, "dont-disturb");

  const { TOP, RIGHT } = Astal.WindowAnchor;

  const [notifications, setNotifications] = createState(
    new Array<AstalNotifd.Notification>(),
  );

  const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
    const notification = notifd.get_notification(id);

    if (replaced && notifications.get().some((n) => n.id === id)) {
      setNotifications((ns) => ns.map((n) => (n.id === id ? notification : n)));
    } else {
      setNotifications((ns) => [notification, ...ns]);
    }
  });

  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id));
  });

  onCleanup(() => {
    notifd.disconnect(notifiedHandler);
    notifd.disconnect(resolvedHandler);
  });

  const shouldShowWindow = createComputed(
    [notifications, isDndMode],
    (notifs, dndEnabled) => {
      return !dndEnabled && notifs.length > 0;
    },
  );

  return (
    <window
      $={(self) => onCleanup(() => self.destroy())}
      name={WINDOW_NAME}
      cssClasses={["notifications"]}
      gdkmonitor={gdkmonitor}
      visible={shouldShowWindow}
      anchor={TOP | RIGHT}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
        <For each={notifications}>{(n) => <Notification n={n} />}</For>
      </box>
    </window>
  );
};
