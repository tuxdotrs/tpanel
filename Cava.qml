pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Io

Singleton {
  id: root

  readonly property string configPath: {
    const url = Quickshell.shellPath("assets/cava.conf").toString();
    return url.startsWith("file://") ? decodeURIComponent(url.substring(7)) : url;
  }
  property var values: []

  Process {
    running: true
    command: ["cava", "-p", root.configPath]

    stdout: SplitParser {
      onRead: line => {
        root.values = line.split(";").map(Number).filter(v => !Number.isNaN(v));
      }
    }
  }
}
