pragma ComponentBehavior: Bound

import QtQuick
import qs.config
import qs.services

Rectangle {
    id: root

    property int barCount: 14
    property real maxValue: 100
    readonly property bool shouldVisualize: barCount > 0 && Cava.values.some(v => v >= 0.001)

    implicitWidth: Theme.cava.width
    implicitHeight: Theme.cava.height
    radius: Theme.radius
    color: Theme.colors.inActive
    visible: shouldVisualize

    Row {
        id: barRow

        anchors.fill: parent
        anchors.margins: Theme.cava.innerMargin
        spacing: Theme.cava.barSpacing

        Repeater {
            model: root.barCount

            Rectangle {
                id: bar

                required property int index
                readonly property real value: Cava.values[index] ?? 0

                width: (barRow.width - barRow.spacing * (root.barCount - 1)) / root.barCount
                height: Math.max(Theme.cava.barMinHeight, (bar.value / root.maxValue) * barRow.height)
                anchors.bottom: parent.bottom
                radius: bar.width / 2
                color: Theme.colors.accent
                antialiasing: true

                Behavior on height {
                    NumberAnimation {
                        duration: Theme.duration
                    }
                }
            }
        }
    }
}
