pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import qs.config
import qs.services
import qs.ui

BarButton {
    id: root

    readonly property real level: Math.max(0, Math.min(Audio.muted ? 0 : Audio.volume, 1))
    readonly property url iconUrl: `${Quickshell.shellPath("assets")}/icons/speaker.svg`

    hoverHighlight: false
    pointerCursor: false
    iconOnly: true
    iconSource: root.iconUrl
    icon.width: Theme.volume.iconSize
    icon.height: Theme.volume.iconSize

    implicitWidth: Theme.volume.width
    implicitHeight: Theme.volume.height

    Rectangle {
        id: fill

        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        implicitWidth: parent.width * root.level
        radius: Theme.radius
        color: Audio.muted ? Theme.colors.error : Theme.colors.accent
        opacity: 0.35

        Behavior on width {
            NumberAnimation {
                duration: Theme.duration
            }
        }
    }
}
