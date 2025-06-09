import { App, Astal, Gdk } from "astal/gtk4";
import { FocusedClient, WorkspaceButton } from "./workspace";
import { Battery } from "./battery";
import { Tailscale } from "./tailscale";
import { Time } from "./time";
import { Network } from "./network";
import { Profile } from "./profile";
import { GPU } from "./gpu";
import { CPU } from "./cpu";
import { Launcher } from "./launcher";

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
      application={App}
    >
      <centerbox>
        <Start />
        <Center />
        <End />
      </centerbox>
    </window>
  );
};

const Start = () => {
  return (
    <box spacing={10}>
      <Launcher />
      <WorkspaceButton />
    </box>
  );
};

const Center = () => {
  return <FocusedClient />;
};

const End = () => {
  return (
    <box spacing={10}>
      <Network />
      <CPU />
      <GPU />
      <Profile />
      <Tailscale />
      <Battery />
      <Time />
    </box>
  );
};
