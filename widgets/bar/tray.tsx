import { bind } from "astal";
import AstalTray from "gi://AstalTray";

const tray = AstalTray.get_default();

export const Tray = () => {
  return (
    <box cssClasses={["pill", "tray"]}>
      {bind(tray, "items").as((items) =>
        items.map((item) => <Item item={item} />),
      )}
    </box>
  );
};

const Item = ({ item }: { item: AstalTray.TrayItem }) => {
  return (
    <menubutton>
      <image gicon={bind(item, "gicon")} />
    </menubutton>
  );
};
