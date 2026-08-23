pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import qs.config
import qs.services
import "../modules/osd"

PanelWindow {
  id: root

  readonly property int cardWidth: 420

  color: "transparent"
  exclusionMode: ExclusionMode.Ignore
  visible: Notifications.popupCount > 0
  implicitWidth: root.cardWidth
  implicitHeight: stack.implicitHeight

  anchors {
    top: true
    right: true
  }
  margins {
    top: 50 + Appearance.margin
    right: 10 + Appearance.margin
  }

  mask: Region {
    item: stack
  }

  ColumnLayout {
    id: stack

    anchors.top: parent.top
    anchors.right: parent.right
    anchors.left: parent.left
    spacing: Appearance.spacing

    Repeater {
      model: [...Notifications.popups.values].reverse()

      NotificationCard {
        id: card

        required property var modelData

        notif: modelData
        Layout.fillWidth: true
      }
    }
  }
}
