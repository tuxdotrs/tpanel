import { bind } from "astal";
import AstalBattery from "gi://AstalBattery";

export const Battery = () => {
  const battery = AstalBattery.get_default();

  return (
    <box cssClasses={["pill"]} visible={bind(battery, "isPresent")}>
      <label
        label={bind(battery, "percentage").as(
          (p) => `B: ${Math.floor(p * 100)}%`,
        )}
      />
    </box>
  );
};
