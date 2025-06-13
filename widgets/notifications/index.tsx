import { Astal, Gdk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { bind } from "astal";
import { NotificationWidget } from "./notification";

export const WINDOW_NAME = "notifications";

export const Notifications = (gdkmonitor: Gdk.Monitor) => {
  const notifd = Notifd.get_default();
  const { TOP, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      name={WINDOW_NAME}
      cssClasses={["notifications"]}
      gdkmonitor={gdkmonitor}
      anchor={TOP | RIGHT}
      visible={bind(notifd, "notifications").as(
        (notifications) => notifications.length > 0,
      )}
    >
      <box vertical={true} spacing={10}>
        {bind(notifd, "notifications").as((notifications) =>
          notifications.map((n) => <NotificationWidget n={n} />),
        )}
      </box>
    </window>
  );
};
