pragma ComponentBehavior: Bound

import QtQuick
import Quickshell.Hyprland
import qs.config

Item {
    id: root

    property int count: 7

    implicitWidth: pillsRow.implicitWidth
    implicitHeight: Theme.workspaces.height
    Behavior on implicitWidth {
        NumberAnimation {
            duration: Theme.duration
            easing.type: Easing.OutQuint
        }
    }

    Row {
        id: pillsRow

        anchors.fill: parent
        spacing: Theme.spacing

        Repeater {
            model: root.count

            Rectangle {
                id: pill

                required property int index
                property var ws: Hyprland.workspaces.values.find(w => w.id === pill.index + 1)
                property bool isActive: Hyprland.focusedWorkspace?.id === (pill.index + 1)

                z: 1
                radius: Theme.workspaces.radius
                implicitHeight: Theme.workspaces.height
                implicitWidth: pill.isActive ? pill.implicitHeight * Theme.workspaces.activeWidthRatio : pill.implicitHeight
                color: {
                    if (pill.isActive)
                        return "transparent";
                    if (handler.hovered)
                        return Theme.colors.accent;
                    if (pill.ws)
                        return Theme.colors.secondaryForeground;
                    return Theme.colors.inActive;
                }

                MouseArea {
                    hoverEnabled: true
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: Hyprland.dispatch("hl.dsp.focus({ workspace = " + (pill.index + 1) + " })")
                }

                HoverHandler {
                    id: handler
                }

                Behavior on color {
                    ColorAnimation {
                        duration: Theme.duration + 50
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

    Rectangle {
        id: highlight

        z: 2
        radius: Theme.workspaces.radius
        color: Theme.colors.accent

        readonly property real activeW: Theme.workspaces.height * Theme.workspaces.activeWidthRatio
        readonly property real inactiveW: Theme.workspaces.height
        property int curIdx: Hyprland.focusedWorkspace ? Hyprland.focusedWorkspace.id - 1 : -1
        property int prevIdx: 0

        function getX(index, activeIndex) {
            if (index < 0)
                return 0;
            let x = 0;
            for (let i = 0; i < index; i++)
                x += (i === activeIndex ? activeW : inactiveW) + pillsRow.spacing;
            return x;
        }

        property real targetLeft: curIdx >= 0 ? getX(curIdx, curIdx) : 0
        property real targetRight: curIdx >= 0 ? targetLeft + activeW : 0
        property real actualLeft: targetLeft
        property real actualRight: targetRight

        Behavior on actualLeft {
            NumberAnimation {
                id: leftAnim
                duration: Theme.duration
                easing.type: Easing.OutQuint
            }
        }

        Behavior on actualRight {
            NumberAnimation {
                id: rightAnim
                duration: Theme.duration
                easing.type: Easing.OutQuint
            }
        }

        onCurIdxChanged: {
            if (curIdx >= 0 && prevIdx >= 0) {
                if (curIdx > prevIdx) {
                    leftAnim.duration = 400;
                    rightAnim.duration = 300;
                } else if (curIdx < prevIdx) {
                    leftAnim.duration = 300;
                    rightAnim.duration = 400;
                }
            }
            if (curIdx >= 0)
                prevIdx = curIdx;
        }

        x: actualLeft
        width: actualRight - actualLeft
        height: parent.height
        opacity: curIdx >= 0 ? 1 : 0
        Behavior on opacity {
            NumberAnimation {
                duration: 180
            }
        }
    }
}
