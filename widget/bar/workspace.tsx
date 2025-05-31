import { Variable, bind } from "astal";
import { Gtk } from "astal/gtk4";
import { ButtonProps } from "astal/gtk4/widget";
import AstalHyprland from "gi://AstalHyprland";

type WsButtonProps = ButtonProps & {
  ws: AstalHyprland.Workspace;
};

const Workspace = ({ ws, ...props }: WsButtonProps) => {
  const hyprland = AstalHyprland.get_default();
  const classNames = Variable.derive(
    [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
    (fws, _) => {
      const classes = ["workspace-button"];

      const active = fws.id == ws.id;
      active && classes.push("active");

      const occupied = hyprland.get_workspace(ws.id)?.get_clients().length > 0;
      occupied && classes.push("occupied");
      return classes;
    },
  );

  return (
    <button
      cssClasses={classNames()}
      onDestroy={() => classNames.drop()}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={() => ws.focus()}
      {...props}
    />
  );
};

export const WorkspaceButton = () => {
  const range = Array.from({ length: 4 + 1 }, (_, i) => i);
  return (
    <box cssClasses={["workspace-container"]} spacing={4}>
      {range.map((i) => (
        <Workspace ws={AstalHyprland.Workspace.dummy(i + 1, null)} />
      ))}
    </box>
  );
};

export const FocusedClient = () => {
  const hyprland = AstalHyprland.get_default();
  const title = bind(hyprland, "focusedClient").as(
    (fcsClient) => fcsClient.title,
  );

  return <label cssClasses={["focused-client"]}>{title}</label>;
};
