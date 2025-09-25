import { Gdk, Gtk } from "ags/gtk4";
import { exec } from "ags/process";
import GLib from "gi://GLib";

export const Header = () => {
  const { VERTICAL } = Gtk.Orientation;
  const { CENTER, START, END } = Gtk.Align;

  return (
    <box cssClasses={["header"]}>
      <image
        css="margin-left: -15px;"
        file={`${GLib.get_user_config_dir()}/tpanel/assets/avatar.png`}
        pixelSize={100}
      />

      <box valign={CENTER} orientation={VERTICAL} spacing={5}>
        <label halign={START} label="tux" />
        <label halign={START} label="@tuxdotrs" />
      </box>

      <box hexpand halign={END} spacing={10} cssClasses={["controls"]}>
        <button
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
          onClicked={() => exec("hyprlock")}
        >
          <image iconName="fa-lock-symbolic" />
        </button>

        <button
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
          onClicked={() => exec("poweroff")}
        >
          <image iconName="fa-power-symbolic" />
        </button>
      </box>
    </box>
  );
};
