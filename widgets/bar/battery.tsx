import { bind, Variable } from "astal";
import AstalBattery from "gi://AstalBattery";

export const Battery = () => {
  const battery = AstalBattery.get_default();
  const chargingIcon = Variable.derive(
    [
      bind(battery, "percentage"),
      bind(battery, "charging"),
      bind(battery, "state"),
    ],
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
    <box cssClasses={["pill"]} visible={bind(battery, "isPresent")} spacing={5}>
      <image iconName={chargingIcon()} onDestroy={() => chargingIcon.drop()} />
      <label
        label={bind(battery, "percentage").as((p) => `${Math.floor(p * 100)}%`)}
      />
    </box>
  );
};
