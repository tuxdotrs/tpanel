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
        return wifi.ssid;
      case 1:
        return "Connecting";
      case 2:
        return "Disconnected";
    }

    return "NA";
  };

  return (
    <box cssClasses={["pill"]}>
      <box spacing={5}>
        <image iconName="fa-wifi-symbolic" />
        <label label={connnectivity((c) => getNetworkText(c, network))} />
      </box>
    </box>
  );
};
