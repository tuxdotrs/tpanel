import { App } from "astal/gtk4";
import { WINDOW_NAME } from "../app-launcher";

export const Launcher = () => {
  return (
    <button
      cssClasses={["pill", "launcher"]}
      onClicked={() => App.toggle_window(WINDOW_NAME)}
    >
      <image iconName="nix-symbolic" />
    </button>
  );
};
