pragma ComponentBehavior: Bound

import QtQuick
import Quickshell.Hyprland
import qs.config

Row {
    id: root

    property int count: 7

    spacing: Appearance.spacing

    Repeater {
        model: root.count

        Rectangle {
            id: pill

            required property int index
            property var ws: Hyprland.workspaces.values.find(w => w.id === pill.index + 1)
            property bool isActive: Hyprland.focusedWorkspace?.id === (pill.index + 1)

            radius: 1000
            implicitHeight: 15
            implicitWidth: pill.isActive ? pill.implicitHeight * 2.3 : pill.implicitHeight
            color: {
                if (handler.hovered)
                    return Appearance.colors.accent;
                if (pill.isActive || pill.ws)
                    return Appearance.colors.accent;
                return Appearance.colors.inActive;
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
                    duration: Appearance.duration
                }
            }

            Behavior on implicitWidth {
                NumberAnimation {
                    duration: Appearance.duration
                    easing.type: Easing.OutQuad
                }
            }
        }
    }
}
