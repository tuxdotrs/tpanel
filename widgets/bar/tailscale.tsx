import { bind, Variable } from "astal";

export const Tailscale = () => {
  const tailscale = Variable("").poll(5000, [
    "bash",
    "-c",
    "tailscale ping vega",
  ]);

  return (
    <box cssClasses={["pill"]}>
      <label
        label={bind(tailscale).as((val) => {
          const data = val.split(" ");
          return "H: " + data[data.length - 1];
        })}
      />
    </box>
  );
};
