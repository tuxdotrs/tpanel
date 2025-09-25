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
import { FocusedClient, WorkspaceButton } from "./workspace";
import { Volume } from "./volume";

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
          <WorkspaceButton />
        </box>

        <box spacing={10} $type="center">
          <FocusedClient />
        </box>

        <box spacing={10} $type="end">
          <Network />
          <CPU />
          <GPU />
          <Profile />
          <Tailscale />
          <Volume />
          <Battery />
          <Tray />
          <Time />
          <Launcher windowName="control-center" icon="fa-ghost-symbolic" />
        </box>
      </centerbox>
    </window>
  );
};
