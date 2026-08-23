pragma ComponentBehavior: Bound

import Quickshell
import Quickshell.Wayland

PanelWindow {
  property string name

  implicitWidth: 0
  implicitHeight: 0
  WlrLayershell.namespace: `quickshell:${name}ExclusionZone`
}
