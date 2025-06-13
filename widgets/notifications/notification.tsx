import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { urgency, createTimeoutManager } from "./notifd";

export const NotificationWidget = ({ n }: { n: Notifd.Notification }) => {
  const { START, CENTER } = Gtk.Align;
  const actions = n.actions || [];
  const TIMEOUT_DELAY = 3000;

  // Keep track of notification validity
  const timeoutManager = createTimeoutManager(() => n.dismiss(), TIMEOUT_DELAY);

  return (
    <box
      setup={(self) => {
        // Set up timeout
        timeoutManager.setupTimeout();

        self.connect("unrealize", () => {
          timeoutManager.cleanup();
        });
      }}
      cssClasses={["notification", `${urgency(n)}`]}
      name={n.id.toString()}
      spacing={10}
    >
      <box vertical cssClasses={["text"]} spacing={10}>
        <label
          cssClasses={["title"]}
          label={bind(n, "summary")}
          halign={START}
        />
        {n.body && (
          <label cssClasses={["body"]} label={bind(n, "body")} halign={START} />
        )}
      </box>
      {actions.length > 0 && (
        <box cssClasses={["actions"]}>
          {actions.map(({ label, id }) => (
            <button
              hexpand
              cssClasses={["action-button"]}
              onClicked={() => n.invoke(id)}
            >
              <label label={label} halign={CENTER} hexpand />
            </button>
          ))}
        </box>
      )}
    </box>
  );
};
