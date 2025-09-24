import app from "ags/gtk4/app";
import GLib from "gi://GLib";
import style from "./style.scss";
import windows from "./windows";

const icons = `${GLib.get_user_config_dir()}/tpanel/assets/icons`;

app.start({
  css: style,
  icons: icons,
  main() {
    windows.map((win) => app.get_monitors().map(win));
  },
});
