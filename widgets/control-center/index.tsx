import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { Footer } from "./footer";
import { Header } from "./header";
import { NotificationList } from "./notification-list";
import { SlidingControls } from "./sliding-controls";
import { SystemInfo } from "./system-info";
import { onCleanup } from "ags";

export const WINDOW_NAME = "control-center";

export const ControlCenter = ({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) => {
  const { TOP, BOTTOM, RIGHT } = Astal.WindowAnchor;
  const { VERTICAL } = Gtk.Orientation;

  return (
    <window
      name={WINDOW_NAME}
      cssClasses={["control-center"]}
      gdkmonitor={gdkmonitor}
      application={app}
      keymode={Astal.Keymode.ON_DEMAND}
      anchor={TOP | BOTTOM | RIGHT}
      $={(self) => onCleanup(() => self.destroy())}
    >
      <Gtk.EventControllerKey onKeyPressed={onKey} />
      <box vexpand orientation={VERTICAL} spacing={20}>
        <Header />
        <SlidingControls />
        <SystemInfo />
        <NotificationList />
        <Footer />
      </box>
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
