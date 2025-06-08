import { bind } from "astal";
import AstalNetwork from "gi://AstalNetwork";

export const Network = () => {
  const network = AstalNetwork.get_default();
  const wifi = bind(network, "wifi");

  return (
    <box cssClasses={["pill"]} visible={wifi.as(Boolean)}>
      {wifi.as(
        (wifi) =>
          wifi && (
            <box spacing={10}>
              <image iconName={bind(wifi, "iconName")} />
              <label label={bind(wifi, "ssid")} />
            </box>
          ),
      )}
    </box>
  );
};
