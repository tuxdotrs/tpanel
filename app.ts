import { App } from "astal/gtk4";
import style from "./style.scss";
import windows from "./windows";

App.start({
  css: style,
  main() {
    windows.map((win) => App.get_monitors().map(win));
  },
});
