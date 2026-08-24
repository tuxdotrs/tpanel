pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import qs.config
import qs.services
import "../modules/osd"

PanelWindow {
    id: root

    property bool shown: false

    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    visible: shown
    implicitWidth: card.implicitWidth
    implicitHeight: card.implicitHeight

    anchors.bottom: true
    margins.bottom: screen.height * Theme.volume.bottomMarginRatio

    // An empty click mask prevents the window from blocking mouse events.
    mask: Region {}

    Connections {
        target: Audio

        function onVolumeChanged() {
            root.shown = true;
            hideTimer.restart();
        }

        function onMutedChanged() {
            root.shown = true;
            hideTimer.restart();
        }
    }

    Timer {
        id: hideTimer

        interval: Theme.volume.timeout
        onTriggered: root.shown = false
    }

    VolumeCard {
        id: card

        anchors.fill: parent
    }
}
