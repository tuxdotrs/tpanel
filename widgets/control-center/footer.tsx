import { Gtk } from "ags/gtk4";

export const Footer = () => {
  const { END } = Gtk.Align;

  return (
    <box valign={END} cssClasses={["footer"]}>
      <label hexpand label="NOBODY FUX WITH TUX" />
    </box>
  );
};
