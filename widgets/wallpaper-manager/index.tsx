import { onCleanup } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { exec } from "ags/process";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

export const WINDOW_NAME = "wallpaper-manager";

// @TODO wallpaper cache
const wallpaperPath = `/home/tux/Wallpapers/new`;
const imageFormats = [".jpeg", ".jpg", ".webp", ".png"];

export const WallpaperManager = ({
  gdkmonitor,
}: {
  gdkmonitor: Gdk.Monitor;
}) => {
  const { TOP, BOTTOM, LEFT } = Astal.WindowAnchor;
  const { VERTICAL } = Gtk.Orientation;
  const wallpaperList = getWallpaperList(wallpaperPath);

  return (
    <window
      name={WINDOW_NAME}
      cssClasses={["wallpaper-manager"]}
      gdkmonitor={gdkmonitor}
      application={app}
      keymode={Astal.Keymode.ON_DEMAND}
      anchor={TOP | BOTTOM | LEFT}
      $={(self) => onCleanup(() => self.destroy())}
    >
      <Gtk.EventControllerKey onKeyPressed={onKey} />
      <scrolledwindow>
        <box orientation={VERTICAL} spacing={20}>
          {wallpaperList.map((wall) => (
            <button
              cssClasses={["button"]}
              cursor={Gdk.Cursor.new_from_name("pointer", null)}
              onClicked={() => setWallpaper(wall)}
            >
              <Gtk.Picture
                file={Gio.file_new_for_path(`${wallpaperPath}/${wall}`)}
                heightRequest={200}
                widthRequest={200}
                hexpand
                vexpand
                cssClasses={["wallpaper-picture"]}
                contentFit={Gtk.ContentFit.COVER}
              />
            </button>
          ))}
        </box>
      </scrolledwindow>
    </window>
  );
};

const onKey = (
  _e: Gtk.EventControllerKey,
  keyval: number,
  _: number,
  mod: number,
) => {
  if (keyval === Gdk.KEY_Escape) {
    app.toggle_window(WINDOW_NAME);
    return;
  }
};

function getWallpaperList(path: string) {
  const dir = Gio.file_new_for_path(path);
  const fileEnum = dir.enumerate_children(
    "standard::name",
    Gio.FileQueryInfoFlags.NONE,
    null,
  );

  const files: string[] = [];
  let i = fileEnum.next_file(null);
  while (i) {
    let fileName = i.get_name();
    if (imageFormats.some((fmt) => fileName.endsWith(fmt))) {
      files.push(fileName);
    }
    i = fileEnum.next_file(null);
  }
  return files;
}

const setWallpaper = (name: string) => {
  const hyprctl = GLib.find_program_in_path("hyprctl");
  const imagePath = `${wallpaperPath}/${name}`;

  if (!hyprctl) return;

  const preloadedWalls = exec([hyprctl, "hyprpaper", "listloaded"]);
  const nWall = preloadedWalls.split("\n").length;
  console.log(nWall);

  if (nWall >= 5) {
    exec([hyprctl, "hyprpaper", "unload", "all"]);
  }

  exec([hyprctl, "hyprpaper", "preload", imagePath]);
  exec([hyprctl, "hyprpaper", "wallpaper", `,${imagePath}`]);

  app.toggle_window(WINDOW_NAME);
};
