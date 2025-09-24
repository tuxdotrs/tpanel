import { createPoll } from "ags/time";

export const Tailscale = () => {
  const tailscale = createPoll("", 5000, [
    "bash",
    "-c",
    "tailscale ping homelab",
  ]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-home-symbolic" />

      <label
        label={tailscale((val) => {
          const data = val.split(" ");
          return data[data.length - 1];
        })}
      />
    </box>
  );
};
