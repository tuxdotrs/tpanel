import { bind, Variable } from "astal";

export const CPU = () => {
  const cpu = Variable("").poll(5000, [
    "bash",
    "-c",
    "cat /sys/class/thermal/thermal_zone*/temp",
  ]);

  return (
    <box cssClasses={["pill"]}>
      <label label={bind(cpu).as((val) => `CPU: ${parseInt(val) / 1000} °C`)} />
    </box>
  );
};
