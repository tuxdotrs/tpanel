pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Controls
import qs.config

Button {
    id: root

    property string label: ""
    property url iconSource: ""
    property bool iconOnly: false
    property bool hoverHighlight: true
    property bool pointerCursor: true

    padding: Theme.padding
    display: iconOnly ? AbstractButton.IconOnly : AbstractButton.TextBesideIcon

    text: label
    font.family: Theme.font.family
    font.pointSize: Theme.font.pointSize
    palette.buttonText: Theme.colors.foreground
    icon.color: Theme.colors.foreground
    icon.source: iconSource

    HoverHandler {
        cursorShape: Qt.PointingHandCursor
        enabled: root.pointerCursor
    }

    background: Rectangle {
        anchors.fill: parent
        radius: Theme.radius
        color: {
            if (!root.hoverHighlight)
                return Theme.colors.inActive;
            return root.hovered ? Theme.colors.inActive : Theme.colors.background;
        }

        Behavior on color {
            ColorAnimation {
                duration: Theme.duration
            }
        }
    }
}
