import { bind, Variable } from "astal";

export const Profile = () => {
  const profile = Variable("").poll(5000, ["bash", "-c", "asusctl profile -p"]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-speed-symbolic" />
      <label
        label={bind(profile).as((val) => {
          const data = val.split(" ");
          return data[data.length - 1];
        })}
      />
    </box>
  );
};
