import { App } from "astal/gtk4";
import style from "./style.scss";
import windows from "./windows";
import GLib from "gi://GLib?version=2.0";

const icons = `${GLib.get_user_config_dir()}/tpanel/assets/icons`;

App.start({
  css: style,
  icons: icons,
  main() {
    windows.map((win) => App.get_monitors().map(win));
  },
});
