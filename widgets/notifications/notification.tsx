import { Gdk, Gtk } from "ags/gtk4";
import Adw from "gi://Adw";
import AstalNotifd from "gi://AstalNotifd";
import GLib from "gi://GLib";
import Pango from "gi://Pango";
import { createTimeoutManager } from "./manager";
import { onCleanup, onMount } from "ags";

const isIcon = (icon?: string | null) => {
  const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!);
  return icon && iconTheme.has_icon(icon);
};

const fileExists = (path: string) => {
  return GLib.file_test(path, GLib.FileTest.EXISTS);
};

const time = (time: number, format = "%H:%M") => {
  return GLib.DateTime.new_from_unix_local(time).format(format)!;
};

const urgency = (n: AstalNotifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency;
  switch (n.urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};

const { VERTICAL } = Gtk.Orientation;
const { START, END, CENTER } = Gtk.Align;

// Keep track of notification validity
const TIMEOUT_DELAY = 3000;

export const Notification = ({ n }: { n: AstalNotifd.Notification }) => {
  const timeoutManager = createTimeoutManager(() => n.dismiss(), TIMEOUT_DELAY);

  onMount(() => {
    timeoutManager.setupTimeout();
  });

  onCleanup(() => {
    timeoutManager.cleanup();
  });

  return (
    <Adw.Clamp maximumSize={400}>
      <box
        widthRequest={400}
        class={`notification ${urgency(n)}`}
        orientation={VERTICAL}
        spacing={20}
      >
        <Gtk.EventControllerMotion
          onEnter={() => timeoutManager.handleHover()}
          onLeave={() => timeoutManager.handleHoverLost()}
        />

        <box class="header" spacing={10}>
          {(n.appIcon || isIcon(n.desktopEntry)) && (
            <image
              class="app-icon"
              visible={Boolean(n.appIcon || n.desktopEntry)}
              iconName={n.appIcon || n.desktopEntry}
            />
          )}
          <label
            class="app-name"
            halign={START}
            ellipsize={Pango.EllipsizeMode.END}
            label={n.appName || "Unknown"}
          />
          <label class="time" hexpand halign={END} label={time(n.time)} />
          <button
            class="close"
            onClicked={() => n.dismiss()}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
          >
            <image iconName="window-close-symbolic" />
          </button>
        </box>
        <box class="content" spacing={10}>
          {n.image && fileExists(n.image) && (
            <image valign={START} class="image" file={n.image} />
          )}
          {n.image && isIcon(n.image) && (
            <box valign={START} class="icon-image">
              <image iconName={n.image} halign={CENTER} valign={CENTER} />
            </box>
          )}
          <box orientation={VERTICAL} valign={CENTER}>
            <label
              class="summary"
              halign={START}
              xalign={0}
              label={n.summary}
              ellipsize={Pango.EllipsizeMode.END}
            />
            {n.body && (
              <label
                class="body"
                wrap
                useMarkup
                halign={START}
                xalign={0}
                justify={Gtk.Justification.FILL}
                label={n.body}
              />
            )}
          </box>
        </box>
        {n.actions.length > 0 && (
          <box class="actions" spacing={5}>
            {n.actions.map(({ label, id }) => (
              <button
                hexpand
                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                onClicked={() => n.invoke(id)}
              >
                <label label={label} halign={CENTER} hexpand />
              </button>
            ))}
          </box>
        )}
      </box>
    </Adw.Clamp>
  );
};
