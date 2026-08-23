pragma ComponentBehavior: Bound

import QtQuick
import Quickshell.Services.SystemTray
import qs.config

Rectangle {
  id: root

  property int iconSize: 16

  implicitWidth: trayRow.implicitWidth + 10
  implicitHeight: 34
  radius: Appearance.radius
  color: Appearance.colors.inActive
  visible: SystemTray.items.values.length > 0

  Row {
    id: trayRow

    anchors.centerIn: parent
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
