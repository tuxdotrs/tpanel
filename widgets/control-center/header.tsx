import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { createPoll } from "ags/time";
import GLib from "gi://GLib";

export const Header = () => {
  const { VERTICAL } = Gtk.Orientation;
  const { CENTER, START, END } = Gtk.Align;

  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format("%a %b %d - %I:%M:%S %p")!,
  );

  return (
    <box cssClasses={["header"]}>
      <image
        css="margin-left: -15px;"
        file={`${GLib.get_user_config_dir()}/tpanel/assets/icons/avatar.png`}
        pixelSize={100}
      />

      <box valign={CENTER} orientation={VERTICAL} spacing={5}>
        <label halign={START} label="tux" />
        <label halign={START} label="@tuxdotrs" />
      </box>

      <box
        hexpand
        halign={END}
        valign={CENTER}
        spacing={10}
        cssClasses={["controls"]}
        orientation={VERTICAL}
      >
        <box spacing={10} homogeneous>
          <button
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => execAsync("flameshot launcher")}
          >
            <image iconName="fa-screenshot-symbolic" />
          </button>

          <button
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => execAsync("hyprlock")}
          >
            <image iconName="fa-lock-symbolic" />
          </button>

          <button
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => execAsync("poweroff")}
          >
            <image iconName="fa-power-symbolic" />
          </button>
        </box>

        <label label={time} />
      </box>
    </box>
  );
};
