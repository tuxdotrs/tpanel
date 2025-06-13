import { Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { fileExists, isIcon } from "./notifd";

export const Icon = (notification: Notifd.Notification) => {
  const icon =
    notification.image || notification.appIcon || notification.desktopEntry;
  if (!icon) return null;
  if (fileExists(icon))
    return (
      <box hexpand={false} vexpand={false} valign={Gtk.Align.CENTER}>
        <image file={icon} />
      </box>
    );
  else if (isIcon(icon))
    return (
      <box hexpand={false} vexpand={false} valign={Gtk.Align.CENTER}>
        <image iconName={icon} />
      </box>
    );
};
