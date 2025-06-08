import { bind, Variable } from "astal";

export const Tailscale = () => {
  const tailscale = Variable("").poll(5000, [
    "bash",
    "-c",
    "tailscale ping vega",
  ]);

  return (
    <box cssClasses={["tailscale"]}>
      <label
        label={bind(tailscale).as((val) => {
          const data = val.split(" ");
          return data[data.length - 1];
        })}
      />
    </box>
  );
};
