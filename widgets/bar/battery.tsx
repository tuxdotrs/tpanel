import { bind } from "astal";
import AstalBattery from "gi://AstalBattery";

export const Battery = () => {
  const battery = AstalBattery.get_default();

  return (
    <box cssClasses={["pill"]} visible={bind(battery, "isPresent")} spacing={5}>
      <image iconName="fa-battery-full-symbolic" />
      <label
        label={bind(battery, "percentage").as((p) => `${Math.floor(p * 100)}%`)}
      />
    </box>
  );
};
