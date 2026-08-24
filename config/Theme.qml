pragma Singleton
pragma ComponentBehavior: Bound

import QtQuick
import Quickshell

Singleton {
    id: root

    property int margin: 8
    property int radius: 8
    property int spacing: 8
    property int padding: 8
    property int duration: 150

    font: QtObject {
        property string family: "FiraCode Nerd Font Mono SemBd"
        property int pointSize: 9
        readonly property int body: pointSize - 1
        readonly property int caption: pointSize - 2
    }

    colors: QtObject {
        property color accent: "#6791c9"
        property color foreground: "#ffffff"
        property color background: "#101213"
        property color inActive: "#1b1d1e"
    }

    bar: QtObject {
        property int thickness: 10
        property int height: 50
    }

    workspaces: QtObject {
        property int height: 15
        property int radius: 1000
        property real activeWidthRatio: 2.3
    }

    cava: QtObject {
        property int width: 96
        property int height: 32
        property int innerMargin: 8
        property int barSpacing: 3
        property int barMinHeight: 2
    }

    tray: QtObject {
        property int iconSize: 16
    }

    notification: QtObject {
        property int width: 420
        property int iconSize: 40
        property int borderWidth: 1
        property int textSpacing: 2
        property real bodyOpacity: 0.8
    }
}
