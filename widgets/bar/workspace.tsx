import { createBinding, createComputed, With } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland";

type WsButtonProps = {
  ws: AstalHyprland.Workspace;
};

const Workspace = ({ ws }: WsButtonProps) => {
  const hyprland = AstalHyprland.get_default();
  const focusedWorkspace = createBinding(hyprland, "focusedWorkspace");

  const classNames = createComputed([focusedWorkspace], (fws) => {
    const classes = ["workspace-button"];

    const active = fws.id == ws.id;
    active && classes.push("active");

    const occupied = hyprland.get_workspace(ws.id)?.get_clients().length > 0;
    occupied && classes.push("occupied");
    return classes;
  });

  return (
    <button
      cssClasses={classNames}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={() => ws.focus()}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
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
  const focused = createBinding(hyprland, "focusedClient");

  return (
    <box cssClasses={["focused-client"]}>
      <With value={focused}>
        {(client) => client && <label label={createBinding(client, "title")} />}
      </With>
    </box>
  );
};
