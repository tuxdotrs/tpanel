import { createPoll } from "ags/time";

export const CPU = () => {
  const cpu = createPoll("", 5000, [
    "bash",
    "-c",
    "cat /sys/class/thermal/thermal_zone*/temp",
  ]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-cpu-symbolic" />
      <label label={cpu((val) => `${parseInt(val) / 1000} °C`)} />
    </box>
  );
};
