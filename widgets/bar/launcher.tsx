import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { WINDOW_NAME as APP_LAUNCHER_WINDOW_NAME } from "../launcher";
import { WINDOW_NAME as CONTROL_CENTER_WINDOW_NAME } from "../control-center";

type Props = {
  icon: string;
  windowName:
  | typeof APP_LAUNCHER_WINDOW_NAME
  | typeof CONTROL_CENTER_WINDOW_NAME;
};

export const Launcher = ({ icon, windowName }: Props) => {
  return (
    <button
      cssClasses={["launcher"]}
      onClicked={() => app.toggle_window(windowName)}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
    >
      <image iconName={icon} />
    </button>
  );
};
