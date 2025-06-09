import { bind, Variable } from "astal";

export const GPU = () => {
  const gpu = Variable("").poll(5000, ["bash", "-c", "supergfxctl -g"]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-video-card-symbolic" />
      <label label={bind(gpu).as((val) => val)} />
    </box>
  );
};
