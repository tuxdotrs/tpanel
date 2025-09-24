import { createBinding, For } from "ags";
import AstalTray from "gi://AstalTray";

export const Tray = () => {
  const tray = AstalTray.get_default();
  const items = createBinding(tray, "items");

  return (
    <box cssClasses={["pill", "tray"]}>
      <For each={items}>{(item) => <Item item={item} />}</For>
    </box>
  );
};

const Item = ({ item }: { item: AstalTray.TrayItem }) => {
  return (
    <menubutton>
      <image gicon={createBinding(item, "gicon")} />
    </menubutton>
  );
};
