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
            <box spacing={5}>
              <image iconName="fa-wifi-symbolic" />
              <label label={bind(wifi, "ssid")} />
            </box>
          ),
      )}
    </box>
  );
};
