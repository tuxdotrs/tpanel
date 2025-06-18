import { App } from "astal/gtk4";
import { WINDOW_NAME } from "./widgets/bar";

export const reqHandler = (req: string, res: (res: any) => void) => {
  switch (req) {
    case "toggle-bar":
      const win = App.get_window(WINDOW_NAME);
      win?.is_visible() ? win.hide() : win?.set_visible(true);
      break;

    default:
      res("uknown command");
  }
};
