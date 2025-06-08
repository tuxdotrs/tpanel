import { bind } from "astal";
import AstalTray from "gi://AstalTray";

export const Tray = () => {
  const tray = AstalTray.get_default();

  for (const item of tray.get_items()) {
    print(item.title);
  }

  return (
    <box cssClasses={["pill"]}>
      {bind(tray, "items").as((items) =>
        items.map((item) => <image gicon={bind(item, "gicon")} />),
      )}
    </box>
  );
};
