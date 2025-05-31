import { bind } from "astal";
import AstalBattery from "gi://AstalBattery";

export const Battery = () => {
  const battery = AstalBattery.get_default();

  return (
    <box visible={bind(battery, "isPresent")}>
      <image iconName={bind(battery, "batteryIconName")} />
      <label
        label={bind(battery, "percentage").as((p) => `${Math.floor(p * 100)}%`)}
      />
    </box>
  );
};
