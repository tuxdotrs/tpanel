import { bind, Variable } from "astal";

export const Tailscale = () => {
  const tailscale = Variable("").poll(5000, [
    "bash",
    "-c",
    "tailscale ping homelab",
  ]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-home-symbolic" />
      <label
        label={bind(tailscale).as((val) => {
          const data = val.split(" ");
          return data[data.length - 1];
        })}
      />
    </box>
  );
};
