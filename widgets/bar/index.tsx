import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { Battery } from "./battery";
import { CPU } from "./cpu";
import { GPU } from "./gpu";
import { Launcher } from "./launcher";
import { Network } from "./network";
import { Profile } from "./profile";
import { Tailscale } from "./tailscale";
import { Time } from "./time";
import { Tray } from "./tray";
import { WorkspaceButton } from "./workspace";

export const WINDOW_NAME = "bar";

export const Bar = (gdkmonitor: Gdk.Monitor) => {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      name={WINDOW_NAME}
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <box spacing={10} $type="start">
          <Launcher windowName="launcher" icon="nix-symbolic" />
          <CPU />
          <GPU />
          <Profile />
          <Tailscale />
        </box>

        <box spacing={10} $type="center">
          <WorkspaceButton />
        </box>

        <box spacing={10} $type="end">
          <Network />
          <Battery />
          <Tray />
          <Time />
          <Launcher windowName="control-center" icon="fa-ghost-symbolic" />
        </box>
      </centerbox>
    </window>
  );
};
