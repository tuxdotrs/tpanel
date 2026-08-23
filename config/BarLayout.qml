pragma Singleton

import Quickshell
import qs.ui
import qs.services

Singleton {
  id: root

  function widget(name: string): url {
    return `${Quickshell.shellPath("modules/bar")}/${name}.qml`;
  }

  property var left: [
    root.widget("LauncherButton"),
    root.widget("BatteryIndicator"),
    root.widget("CavaVisualizer")
  ]

  property var center: [
    root.widget("Workspaces")
  ]

  property var right: [
    root.widget("SystemTrayWidget"),
    root.widget("ClockWidget"),
    root.widget("GhostButton")
  ]
}
