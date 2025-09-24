import { createState, For } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import AstalApps from "gi://AstalApps";

export const WINDOW_NAME = "launcher";

let searchEntry: Gtk.Entry;
const apps = new AstalApps.Apps();
const [searchText, setSearchText] = createState("");

const hide = () => {
  app.get_window(WINDOW_NAME)?.set_visible(false);
};

const AppButton = ({ app }: { app: AstalApps.Application }) => {
  return (
    <button
      cssClasses={["button"]}
      onClicked={() => {
        hide();
        app.launch();
      }}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
    >
      <box spacing={6} halign={Gtk.Align.START} valign={Gtk.Align.CENTER}>
        <image iconName={app.iconName} iconSize={Gtk.IconSize.LARGE} />
        <label cssClasses={["name"]} xalign={0} label={app.name} />
      </box>
    </button>
  );
};

const AppList = () => {
  const appList = searchText((text) => apps.fuzzy_query(text));

  return (
    <Gtk.ScrolledWindow vexpand heightRequest={500} widthRequest={300}>
      <box
        spacing={6}
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["list"]}
      >
        <For each={appList}>{(app) => <AppButton app={app} />}</For>
      </box>
    </Gtk.ScrolledWindow>
  );
};

const AppSearch = () => {
  return (
    <entry
      $={(ref) => (searchEntry = ref)}
      cssClasses={["search"]}
      text={searchText}
      placeholderText="Search..."
      onNotifyText={({ text }) => setSearchText(text)}
    />
  );
};

export const Launcher = (gdkmonitor: Gdk.Monitor) => {
  return (
    <window
      name={WINDOW_NAME}
      cssClasses={["launcher"]}
      gdkmonitor={gdkmonitor}
      application={app}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      keymode={Astal.Keymode.ON_DEMAND}
      onNotifyVisible={({ visible }) => {
        if (visible) searchEntry.grab_focus();
        else searchEntry.set_text("");
      }}
    >
      <Gtk.EventControllerKey onKeyPressed={onKey} />

      <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
        <AppSearch />
        <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />
        <AppList />
      </box>
    </window>
  );
};

const onKey = (
  _e: Gtk.EventControllerKey,
  keyval: number,
  _: number,
  mod: number,
) => {
  if (keyval === Gdk.KEY_Escape) {
    app.toggle_window(WINDOW_NAME);
    return;
  }
};
