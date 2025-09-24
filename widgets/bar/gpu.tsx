import { createPoll } from "ags/time";

export const GPU = () => {
  const gpu = createPoll("", 5000, ["bash", "-c", "supergfxctl -g"]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-video-card-symbolic" />
      <label label={gpu((val) => val)} />
    </box>
  );
};
