import { createBinding } from "ags";
import AstalWp from "gi://AstalWp";

export const Volume = () => {
  const { defaultSpeaker: speaker, defaultMicrophone: microphone } =
    AstalWp.get_default()!;

  const speakerIsMuted = createBinding(speaker, "mute");

  return (
    <>
      <box cssClasses={["pill", "volume"]} spacing={5}>
        <image
          iconName={speakerIsMuted((val) =>
            val ? "fa-speaker-muted-symbolic" : "fa-speaker-symbolic",
          )}
        />

        <slider
          widthRequest={100}
          onChangeValue={({ value }) => speaker.set_volume(value)}
          value={createBinding(speaker, "volume")}
        />
      </box>

      <box cssClasses={["pill", "volume"]} spacing={5}>
        <image iconName="fa-microphone-symbolic" />
        <slider
          widthRequest={100}
          onChangeValue={({ value }) => microphone.set_volume(value)}
          value={createBinding(microphone, "volume")}
        />
      </box>
    </>
  );
};
