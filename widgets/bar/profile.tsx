import { createPoll } from "ags/time";

export const Profile = () => {
  const profile = createPoll("", 5000, ["bash", "-c", "asusctl profile -p"]);

  return (
    <box cssClasses={["pill"]} spacing={5}>
      <image iconName="fa-speed-symbolic" />
      <label
        label={profile((val) => {
          const data = val.split(" ");
          return data[data.length - 1];
        })}
      />
    </box>
  );
};
