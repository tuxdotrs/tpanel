import { Gtk } from "ags/gtk4";

export const NotificationList = () => {
  const { VERTICAL } = Gtk.Orientation;

  return (
    <box vexpand orientation={VERTICAL} spacing={20}>
      <label label="Notifications" />
      <box vexpand cssClasses={["pill"]}></box>
    </box>
  );
};
