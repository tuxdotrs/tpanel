import { createPoll } from "ags/time";
import GLib from "gi://GLib";

export const Time = () => {
  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format("%a %b %d - %I:%M:%S %p")!,
  );

  return <label cssClasses={["pill"]} label={time} />;
};
