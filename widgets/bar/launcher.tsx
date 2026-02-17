import { Gdk, Gtk } from "ags/gtk4";

type Props = {
  icon: string;
  onClicked?: ((source: Gtk.Button) => void) | undefined;
};

export const Launcher = ({ icon, onClicked }: Props) => {
  return (
    <button
      cssClasses={["launcher"]}
      onClicked={onClicked}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
    >
      <image iconName={icon} />
    </button>
  );
};
