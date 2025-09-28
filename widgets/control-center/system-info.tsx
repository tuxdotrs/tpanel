import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";

export const SystemInfo = () => {
  const cpu = PollCMD("cat /sys/class/thermal/thermal_zone*/temp");
  const gpu = PollCMD("supergfxctl -g");
  const profile = PollCMD("asusctl profile -p");
  const tailscale = PollCMD("tailscale ping homelab");
  const cpuUsage = PollCMD(
    `awk '{u=$2+$4; t=$2+$3+$4+$5+$6+$7+$8; if(NR==1){u1=u; t1=t}else{printf "%.1f%%",(u-u1)*100/(t-t1)}}' <(grep '^cpu ' /proc/stat; sleep 1; grep '^cpu ' /proc/stat)`,
    2000,
  );
  const ramUsage = PollCMD(
    `awk '/MemTotal:|MemAvailable:/ {if($1=="MemTotal:") total=$2; if($1=="MemAvailable:") avail=$2} END {used=total-avail; printf "%.1f%%", used/total*100}' /proc/meminfo`,
    2000,
  );

  return (
    <>
      <box hexpand homogeneous spacing={20} cssClasses={["system-info"]}>
        <box
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-cpu-usage-symbolic" />
          <label label={cpuUsage} />
        </box>

        <box
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-ram-symbolic" />
          <label label={ramUsage} />
        </box>

        <box
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-cpu-symbolic" />
          <label label={cpu((val) => `${parseInt(val) / 1000} °C`)} />
        </box>
      </box>

      <box hexpand homogeneous spacing={20} cssClasses={["system-info"]}>
        <box
          hexpand
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-video-card-symbolic" />
          <label label={gpu((val) => val)} />
        </box>

        <box
          hexpand
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-speed-symbolic" />
          <label
            label={profile((val) => {
              const data = val.split(" ");
              return data[data.length - 1];
            })}
          />
        </box>

        <box
          cssClasses={["pill"]}
          spacing={15}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <image iconName="fa-home-symbolic" />

          <label
            label={tailscale((val) => {
              const data = val.split(" ");
              return data[data.length - 1];
            })}
          />
        </box>
      </box>
    </>
  );
};

const PollCMD = (cmd: string, ms: number = 5000) => {
  return createPoll("", ms, ["bash", "-c", cmd]);
};
