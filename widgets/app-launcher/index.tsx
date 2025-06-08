import { Variable, Gio } from "astal";
import { App, Astal, Gdk, Gtk, hook } from "astal/gtk4";
import AstalApps from "gi://AstalApps";
import { Picture } from "../common";

export const WINDOW_NAME = "app-launcher";
const apps = new AstalApps.Apps();
const text = Variable("");

const hide = () => {
  App.get_window(WINDOW_NAME)?.set_visible(false);
};

const AppButton = ({ app }: { app: AstalApps.Application }) => {
  return (
    <button
      cssClasses={["app-button"]}
      onClicked={() => {
        hide();
        app.launch();
      }}
    >
      <box spacing={6} halign={Gtk.Align.START} valign={Gtk.Align.CENTER}>
        <image iconName={app.iconName} iconSize={Gtk.IconSize.LARGE} />
        <label cssClasses={["name"]} xalign={0} label={app.name} />
      </box>
    </button>
  );
};

const AppList = () => {
  const appList = text((text) => apps.fuzzy_query(text));

  return (
    <Gtk.ScrolledWindow vexpand heightRequest={500} widthRequest={300}>
      <box vertical spacing={6} cssClasses={["app-list"]}>
        {appList.as((list) => list.map((app) => <AppButton app={app} />))}
      </box>
    </Gtk.ScrolledWindow>
  );
};

const AppSearch = () => {
  const onEnter = () => {
    apps.fuzzy_query(text.get())?.[0].launch();
    hide();
  };
  return (
    <overlay cssClasses={["entry-overlay"]} heightRequest={100}>
      <Gtk.ScrolledWindow heightRequest={100}>
        <Picture
          file={Gio.file_new_for_path("/home/tux/Wallpapers/5m5kLI9.png")}
          contentFit={Gtk.ContentFit.COVER}
          overflow={Gtk.Overflow.HIDDEN}
        />
      </Gtk.ScrolledWindow>
      <entry
        type="overlay"
        vexpand
        text={text.get()}
        primaryIconName={"system-search-symbolic"}
        placeholderText="Search..."
        onChanged={(self) => text.set(self.text)}
        onActivate={onEnter}
        setup={(self) => {
          hook(self, App, "window-toggled", (_, win) => {
            const winName = win.name;
            const visible = win.visible;

            if (winName == WINDOW_NAME && visible) {
              text.set("");
              self.set_text("");
              self.grab_focus();
            }
          });
        }}
      />
    </overlay>
  );
};

export const AppLauncher = (gdkmonitor: Gdk.Monitor) => {
  return (
    <window
      name={WINDOW_NAME}
      cssClasses={["app-launcher"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      application={App}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(_, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          App.toggle_window(WINDOW_NAME);
        }
      }}
    >
      <box vertical spacing={6}>
        <AppSearch />
        <AppList />
      </box>
    </window>
  );
};
