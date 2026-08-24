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

    padding: Appearance.padding
    display: iconOnly ? AbstractButton.IconOnly : AbstractButton.TextBesideIcon

    text: label
    font.family: Appearance.font.family
    font.pointSize: Appearance.font.pointSize
    palette.buttonText: Appearance.colors.foreground
    icon.color: Appearance.colors.foreground
    icon.source: iconSource

    HoverHandler {
        cursorShape: Qt.PointingHandCursor
        enabled: root.pointerCursor
    }

    background: Rectangle {
        anchors.fill: parent
        radius: Appearance.radius
        color: {
            if (!root.hoverHighlight)
                return Appearance.colors.inActive;
            return root.hovered ? Appearance.colors.inActive : Appearance.colors.background;
        }

        Behavior on color {
            ColorAnimation {
                duration: Appearance.duration
            }
        }
    }
}
