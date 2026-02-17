import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { Battery } from "./battery";
import { Launcher } from "./launcher";
import { Network } from "./network";
import { Time } from "./time";
import { Tray } from "./tray";
import { WorkspaceButton } from "./workspace";
import { Bluetooth } from "./bluetooth";
import { Cava } from "./cava";
import { onCleanup } from "gnim";
import { execAsync } from "ags/process";

export const WINDOW_NAME = "bar";

export const Bar = ({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) => {
  const { TOP } = Astal.WindowAnchor;

  return (
    <window
      name={WINDOW_NAME}
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP}
      widthRequest={1200}
      application={app}
      $={(self) => onCleanup(() => self.destroy())}
    >
      <centerbox>
        <box spacing={10} $type="start">
          <Launcher
            icon="nix-symbolic"
            onClicked={() => execAsync("vicinae toggle")}
          />
          <Network />
          <Battery />
        </box>

        <box spacing={10} $type="center">
          <Cava />
          <WorkspaceButton />
          <Cava />
        </box>

        <box spacing={10} $type="end">
          <Bluetooth />
          <Tray />
          <Time />
          <Launcher
            icon="fa-ghost-symbolic"
            onClicked={() => app.toggle_window("control-center")}
          />
        </box>
      </centerbox>
    </window>
  );
};
