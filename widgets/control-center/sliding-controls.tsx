import { createBinding } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import AstalWp from "gi://AstalWp";
import Brightness from "../../utils/brightness";

export const SlidingControls = () => {
  const { VERTICAL } = Gtk.Orientation;

  const { defaultSpeaker: speaker, defaultMicrophone: microphone } =
    AstalWp.get_default()!;
  const brightness = Brightness.get_default();

  const speakerIsMuted = createBinding(speaker, "mute");

  return (
    <box spacing={20} cssClasses={["pill"]} orientation={VERTICAL}>
      <box cssClasses={["volume"]} spacing={20}>
        <image
          iconName={speakerIsMuted((val) =>
            val ? "fa-speaker-muted-symbolic" : "fa-speaker-symbolic",
          )}
        />

        <slider
          hexpand
          onChangeValue={({ value }) => speaker.set_volume(value)}
          value={createBinding(speaker, "volume")}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
        />
      </box>

      <box cssClasses={["volume"]} spacing={20}>
        <image iconName="fa-microphone-symbolic" />
        <slider
          hexpand
          onChangeValue={({ value }) => microphone.set_volume(value)}
          value={createBinding(microphone, "volume")}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
        />
      </box>

      <box cssClasses={["volume"]} spacing={20}>
        <image iconName="fa-brightness-symbolic" />
        <slider
          hexpand
          onChangeValue={(self) => {
            brightness.screen = self.value;
          }}
          value={createBinding(brightness, "screen")}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
        />
      </box>

      <box cssClasses={["volume"]} spacing={20}>
        <image iconName="fa-keyboard-symbolic" />
        <slider
          hexpand
          min={0}
          max={3}
          step={1}
          onChangeValue={(self) => {
            brightness.kbd = self.value;
          }}
          value={createBinding(brightness, "kbd")}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
        />
      </box>
    </box>
  );
};
