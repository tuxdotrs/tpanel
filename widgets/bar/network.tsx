import { Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";
import AstalNetwork from "gi://AstalNetwork";
import { createBinding } from "gnim";

export const Network = () => {
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
        let ssid = wifi.ssid ? wifi.ssid : "";
        let text = ssid.length > 10 ? ssid.substring(0, 10) + "..." : ssid;
        return text;
      case 1:
        return "Connecting";
      case 2:
        return "Disconnected";
    }

    return "NA";
  };

  return (
    <button
      cssClasses={["pill"]}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
      onClicked={() =>
        execAsync(`wezterm start --class wezterm-floating nmtui`)
      }
    >
      <box spacing={5}>
        <image iconName="fa-wifi-symbolic" />
        <label label={connnectivity((c) => getNetworkText(c, network))} />
      </box>
    </button>
  );
};
