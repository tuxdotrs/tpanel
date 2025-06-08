import { GLib, Variable } from "astal";

export const Time = () => {
  const time = Variable("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format("%a %b %d - %I:%M:%S %p")!,
  );

  return (
    <label cssClasses={["pill"]} onDestroy={() => time.drop()} label={time()} />
  );
};
