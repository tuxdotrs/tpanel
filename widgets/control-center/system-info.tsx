import { createBinding, createComputed } from "ags";
import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import AstalBattery from "gi://AstalBattery";
import AstalNetwork from "gi://AstalNetwork";

export const SystemInfo = () => {
  const cpu = PollCMD("cat /sys/class/thermal/thermal_zone*/temp");
  const gpu = PollCMD("supergfxctl -g");
  const profile = PollCMD("asusctl profile -p");
  const tailscale = PollCMD("tailscale ping homelab");

  const battery = AstalBattery.get_default();

  const percentage = createBinding(battery, "percentage");
  const charging = createBinding(battery, "charging");
  const state = createBinding(battery, "state");
  const energyRate = createBinding(battery, "energyRate");

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

  const network = AstalNetwork.get_default();
  const connnectivity = createBinding(network, "connectivity");

  const getNetworkText = (
    conn: AstalNetwork.Connectivity,
    net: AstalNetwork.Network,
  ) => {
    // no connection
    if (conn == 1) return "No connection";

    // wired
    if (net.primary == 1) return "Wired";

    // wifi
    const wifi = net.wifi;
    switch (wifi.internet) {
      case 0:
        return wifi.ssid;
      case 1:
        return "Connecting";
      case 2:
        return "Disconnected";
    }

    return "NA";
  };

  return (
    <>
      <box hexpand homogeneous spacing={20} cssClasses={["system-info"]}>
        <box
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-wifi-symbolic" />
          <label label={connnectivity((c) => getNetworkText(c, network))} />
        </box>

        <box
          hexpand
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-video-card-symbolic" />
          <label label={gpu((val) => val)} />
        </box>

        <box
          hexpand
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-speed-symbolic" />
          <label
            label={profile((val) => {
              const data = val.split(" ");
              return data[data.length - 1];
            })}
          />
        </box>
      </box>

      <box hexpand homogeneous spacing={20} cssClasses={["system-info"]}>
        <box
          hexpand
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-cpu-symbolic" />
          <label label={cpu((val) => `${parseInt(val) / 1000} °C`)} />
        </box>

        <box
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-home-symbolic" />

          <label
            label={tailscale((val) => {
              const data = val.split(" ");
              return data[data.length - 1];
            })}
          />
        </box>

        <box
          cssClasses={["pill"]}
          visible={createBinding(battery, "isPresent")}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName={chargingIcon} />
          <box hexpand halign={Gtk.Align.CENTER} spacing={5}>
            <label label={percentage((p) => `${Math.floor(p * 100)}%`)} />
            <label label={energyRate((v) => `${Math.floor(v * 10) / 10}W`)} />
          </box>
        </box>
      </box>
    </>
  );
};

const PollCMD = (cmd: string, ms: number = 5000) => {
  return createPoll("", ms, ["bash", "-c", cmd]);
};
