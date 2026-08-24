pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import qs.config
import qs.services
import "../modules/osd"

PanelWindow {
    id: root

    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    visible: Notifications.popupCount > 0
    implicitWidth: Theme.notification.width
    implicitHeight: stack.implicitHeight

    anchors {
        top: true
        right: true
    }
    margins {
        top: Theme.bar.height + Theme.margin
        right: Theme.bar.thickness + Theme.margin
    }

    mask: Region {
        item: stack
    }

    ColumnLayout {
        id: stack

        anchors.top: parent.top
        anchors.right: parent.right
        anchors.left: parent.left
        spacing: Theme.spacing

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
