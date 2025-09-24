import { createBinding, createComputed } from "ags";
import AstalBattery from "gi://AstalBattery";

export const Battery = () => {
  const battery = AstalBattery.get_default();

  const percentage = createBinding(battery, "percentage");
  const charging = createBinding(battery, "charging");
  const state = createBinding(battery, "state");

  const chargingIcon = createComputed(
    [percentage, charging, state],
    (percentage, charging, state) => {
      const batFull = state === AstalBattery.State.FULLY_CHARGED;
      const p = percentage * 100;

      if (batFull) return "fa-battery-full-symbolic";
      if (charging) return "fa-battery-charging-symbolic";
      if (p < 30) return "fa-battery-low-symbolic";
      return p < 70 ? "fa-battery-medium-symbolic" : "fa-battery-full-symbolic";
    },
  );

  return (
    <box
      cssClasses={["pill"]}
      visible={createBinding(battery, "isPresent")}
      spacing={5}
    >
      <image iconName={chargingIcon} />
      <label label={percentage((p) => `${Math.floor(p * 100)}%`)} />
    </box>
  );
};
