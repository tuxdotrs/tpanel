import { bind, Variable } from "astal";

export const Profile = () => {
  const profile = Variable("").poll(5000, ["bash", "-c", "asusctl profile -p"]);

  return (
    <box cssClasses={["pill"]}>
      <label
        label={bind(profile).as((val) => {
          const data = val.split(" ");
          return "P: " + data[data.length - 1];
        })}
      />
    </box>
  );
};
