import { App, Gtk } from "astal/gtk4";
import { Gio } from "astal";
import { Picture } from "../common";
import { WINDOW_NAME } from "../app-launcher";

export const Launcher = () => {
  return (
    <Gtk.ScrolledWindow
      heightRequest={30}
      widthRequest={30}
      cssClasses={["launcher"]}
    >
      <button onClicked={() => App.toggle_window(WINDOW_NAME)}>
        <Picture
          file={Gio.file_new_for_path("/home/tux/Wallpapers/avatar.png")}
          contentFit={Gtk.ContentFit.CONTAIN}
          overflow={Gtk.Overflow.HIDDEN}
        />
      </button>
    </Gtk.ScrolledWindow>
  );
};
