pragma ComponentBehavior: Bound

import QtQuick
import Quickshell.Services.SystemTray
import qs.config
import qs.ui

BarButton {
    id: root

    hoverHighlight: false
    pointerCursor: false
    visible: SystemTray.items.values.length > 0

    contentItem: Row {
        spacing: Theme.spacing

        Repeater {
            model: SystemTray.items.values

            Image {
                required property var modelData

                source: modelData.icon
                width: Theme.tray.iconSize
                height: Theme.tray.iconSize
            }
        }
    }
}
