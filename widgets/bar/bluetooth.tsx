import { Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";

export const Bluetooth = () => {
  return (
    <button
      cssClasses={["launcher"]}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
      onClicked={() =>
        execAsync(`wezterm start --class wezterm-floating bluetui`)
      }
    >
      <image iconName="fa-bluetooth-symbolic" />
    </button>
  );
};
