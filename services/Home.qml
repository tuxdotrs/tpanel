pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Io

Singleton {
    id: root

    property string host: "100.64.0.3"
    property int interval: 5000

    // Round-trip time in ms; -1 means unknown/unreachable.
    property int latency: -1
    property bool replied: false

    readonly property url icon: `${Quickshell.shellPath("assets")}/icons/home.svg`

    function ping(): void {
        proc.command = ["ping", "-c", "1", "-W", "2", root.host];
        root.replied = false;
        proc.running = true;
    }

    Timer {
        interval: root.interval
        running: true
        repeat: true
        triggeredOnStart: true
        onTriggered: root.ping()
    }

    Process {
        id: proc

        stdout: SplitParser {
            onRead: line => {
                const match = line.match(/time[=<]([\d.]+)\s*ms/);
                if (match) {
                    root.latency = Math.round(parseFloat(match[1]));
                    root.replied = true;
                }
            }
        }
        onExited: {
            if (!root.replied)
                root.latency = -1;
        }
    }
}
