import { Variable } from "astal";
import { App, Astal, Gdk, Gtk, hook } from "astal/gtk4";
import AstalApps from "gi://AstalApps";

export const WINDOW_NAME = "app-launcher";
const apps = new AstalApps.Apps();
const text = Variable("");

const hide = () => {
  App.get_window(WINDOW_NAME)?.set_visible(false);
};

const AppButton = ({ app }: { app: AstalApps.Application }) => {
  return (
    <button
      cssClasses={["button"]}
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
      <box vertical spacing={6} cssClasses={["list"]}>
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
    <entry
      cssClasses={["search"]}
      vexpand
      text={text.get()}
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
        <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />
        <AppList />
      </box>
    </window>
  );
};
