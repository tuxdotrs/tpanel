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
    root.widget("PowerProfileWidget"),
    root.widget("HomeWidget"),
  ]

  property var center: [
    root.widget("CavaVisualizer"),
    root.widget("Workspaces"),
    root.widget("CavaVisualizer"),
  ]

  property var right: [
    root.widget("AudioWidget"),
    root.widget("BatteryIndicator"),
    root.widget("SystemTrayWidget"),
    root.widget("ClockWidget"),
    root.widget("GhostButton")
  ]
}
