import { bind, Variable } from "astal";

export const CPU = () => {
  const cpu = Variable("").poll(5000, [
    "bash",
    "-c",
    "cat /sys/class/thermal/thermal_zone*/temp",
  ]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-cpu-symbolic" />
      <label label={bind(cpu).as((val) => `${parseInt(val) / 1000} °C`)} />
    </box>
  );
};
