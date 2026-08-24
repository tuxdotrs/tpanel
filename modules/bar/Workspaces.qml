pragma ComponentBehavior: Bound

import QtQuick
import Quickshell.Hyprland
import qs.config

Row {
    id: root

    property int count: 7

    spacing: Theme.spacing

    Repeater {
        model: root.count

        Rectangle {
            id: pill

            required property int index
            property var ws: Hyprland.workspaces.values.find(w => w.id === pill.index + 1)
            property bool isActive: Hyprland.focusedWorkspace?.id === (pill.index + 1)

            radius: Theme.workspaces.radius
            implicitHeight: Theme.workspaces.height
            implicitWidth: pill.isActive ? pill.implicitHeight * Theme.workspaces.activeWidthRatio : pill.implicitHeight
            color: {
                if (handler.hovered)
                    return Theme.colors.accent;
                if (pill.isActive || pill.ws)
                    return Theme.colors.accent;
                return Theme.colors.inActive;
            }

            MouseArea {
                hoverEnabled: true
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: Hyprland.dispatch("workspace " + (pill.index + 1))
            }

            HoverHandler {
                id: handler
            }

            Behavior on color {
                ColorAnimation {
                    duration: Theme.duration
                }
            }

            Behavior on implicitWidth {
                NumberAnimation {
                    duration: Theme.duration
                    easing.type: Easing.OutQuad
                }
            }
        }
    }
}
