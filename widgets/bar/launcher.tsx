import { App } from "astal/gtk4";
import { WINDOW_NAME } from "../app-launcher";
import { Gdk } from "astal/gtk4";

export const Launcher = () => {
  return (
    <button
      cssClasses={["pill", "launcher"]}
      onClicked={() => App.toggle_window(WINDOW_NAME)}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
    >
      <image iconName="nix-symbolic" />
    </button>
  );
};
