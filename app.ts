import app from "ags/gtk4/app";
import GLib from "gi://GLib";
import style from "./style/main.scss";
import { Main } from "./main";

const icons = `${GLib.get_user_config_dir()}/tpanel/assets/icons`;

app.start({
  css: style,
  icons: icons,
  main: Main,
});
