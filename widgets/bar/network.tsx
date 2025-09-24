import AstalNetwork from "gi://AstalNetwork";

export const Network = () => {
  const network = AstalNetwork.get_default();

  return (
    <box cssClasses={["pill"]}>
      <box spacing={5}>
        <image iconName="fa-wifi-symbolic" />
        <label label={network.wifi.ssid} />
      </box>
    </box>
  );
};
