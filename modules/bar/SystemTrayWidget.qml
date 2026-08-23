pragma ComponentBehavior: Bound

import QtQuick
import Quickshell.Services.SystemTray
import qs.config
import qs.ui

BarButton {
  id: root

  property int iconSize: 16

  hoverHighlight: false
  pointerCursor: false
  visible: SystemTray.items.values.length > 0

  contentItem: Row {
    spacing: Appearance.spacing

    Repeater {
      model: SystemTray.items.values

      Image {
        required property var modelData

        source: modelData.icon
        width: root.iconSize
        height: root.iconSize
      }
    }
  }
}
