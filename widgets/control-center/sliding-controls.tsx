import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import AstalWp from "gi://AstalWp";

export const SlidingControls = () => {
  const { VERTICAL } = Gtk.Orientation;

  const { defaultSpeaker: speaker, defaultMicrophone: microphone } =
    AstalWp.get_default()!;

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
        />
      </box>

      <box cssClasses={["volume"]} spacing={20}>
        <image iconName="fa-microphone-symbolic" />
        <slider
          hexpand
          onChangeValue={({ value }) => microphone.set_volume(value)}
          value={createBinding(microphone, "volume")}
        />
      </box>
    </box>
  );
};
