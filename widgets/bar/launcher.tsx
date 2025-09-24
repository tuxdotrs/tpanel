import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { WINDOW_NAME } from "../app-launcher";

export const Launcher = () => {
  return (
    <button
      cssClasses={["pill", "launcher"]}
      onClicked={() => app.toggle_window(WINDOW_NAME)}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
    >
      <image iconName="nix-symbolic" />
    </button>
  );
};
