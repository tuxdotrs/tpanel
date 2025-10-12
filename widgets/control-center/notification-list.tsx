import { Gdk, Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import { createComputed, createBinding } from "ags";

export const NotificationList = () => {
  const { VERTICAL } = Gtk.Orientation;

  const notifd = Notifd.get_default();
  const isDndMode = createBinding(notifd, "dont-disturb");

  const toggleDndMode = () => {
    const currentDnd = notifd.get_dont_disturb();
    notifd.set_dont_disturb(!currentDnd);
  };

  const notificationIcon = createComputed([isDndMode], (dndMode) => {
    if (dndMode) {
      return "fa-bell-off-symbolic";
    }

    return "fa-bell-symbolic";
  });

  return (
    <box
      vexpand
      hexpand
      orientation={VERTICAL}
      spacing={20}
      cssClasses={["notification-list"]}
    >
      <box hexpand>
        <label label="Notifications" />
        <box hexpand halign={Gtk.Align.END} spacing={10}>
          <button
            onClicked={toggleDndMode}
            tooltipText={isDndMode((dnd) =>
              dnd ? "Disable Do Not Disturb" : "Enable Do Not Disturb",
            )}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            class={isDndMode((dnd) => (dnd ? "focus" : ""))}
          >
            <image iconName={notificationIcon} />
          </button>

          <button cursor={Gdk.Cursor.new_from_name("pointer", null)}>
            <image iconName="fa-broom-symbolic" />
          </button>
        </box>
      </box>
      <box vexpand cssClasses={["pill"]}></box>
    </box>
  );
};
