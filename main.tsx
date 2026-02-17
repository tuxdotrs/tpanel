import { For, This, createBinding } from "ags";
import app from "ags/gtk4/app";
import { Bar } from "./widgets/bar";
import { Notifications } from "./widgets/notifications";
import { ControlCenter } from "./widgets/control-center";

export const Main = () => {
  const monitors = createBinding(app, "monitors");

  return (
    <For each={monitors}>
      {(monitor) => (
        <This this={app}>
          <Bar gdkmonitor={monitor} />
          <Notifications gdkmonitor={monitor} />
          <ControlCenter gdkmonitor={monitor} />
        </This>
      )}
    </For>
  );
};
