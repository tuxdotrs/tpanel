pragma Singleton
pragma ComponentBehavior: Bound

import QtQuick
import Quickshell

Singleton {
    id: root

    property string name: "poimandres"

    readonly property Base16 scheme: {
        switch (root.name) {
        case "poimandres":
            return poimandres;
        default:
            return gruvbox;
        }
    }

    component Base16: QtObject {
        property color base00
        property color base01
        property color base02
        property color base03
        property color base04
        property color base05
        property color base06
        property color base07
        property color base08
        property color base09
        property color base0A
        property color base0B
        property color base0C
        property color base0D
        property color base0E
        property color base0F
    }

    Base16 {
        id: poimandres

        base00: "#0f0f0f"
        base01: "#181818"
        base02: "#202020"
        base03: "#292929"
        base04: "#3f3f3f"
        base05: "#E4F0FB"
        base06: "#b6d7f4"
        base07: "#ffffff"
        base08: "#D0679D"
        base09: "#91B4D5"
        base0A: "#FFFAC2"
        base0B: "#5FB3A1"
        base0C: "#5DE4C7"
        base0D: "#89DDFF"
        base0E: "#A6ACCD"
        base0F: "#FCC5E9"
    }

    readonly property QtObject colors: QtObject {
        readonly property color base00: root.scheme.base00
        readonly property color base01: root.scheme.base01
        readonly property color base02: root.scheme.base02
        readonly property color base03: root.scheme.base03
        readonly property color base04: root.scheme.base04
        readonly property color base05: root.scheme.base05
        readonly property color base06: root.scheme.base06
        readonly property color base07: root.scheme.base07
        readonly property color base08: root.scheme.base08
        readonly property color base09: root.scheme.base09
        readonly property color base0A: root.scheme.base0A
        readonly property color base0B: root.scheme.base0B
        readonly property color base0C: root.scheme.base0C
        readonly property color base0D: root.scheme.base0D
        readonly property color base0E: root.scheme.base0E
        readonly property color base0F: root.scheme.base0F

        readonly property color accent: base0D
        readonly property color foreground: base05
        readonly property color background: base00
        readonly property color inActive: base01
        readonly property color hover: base02
        readonly property color border: base03
        readonly property color secondaryForeground: base04
        readonly property color error: base08
        readonly property color warning: base0A
        readonly property color success: base0B
        readonly property color info: base0C
    }

    property int margin: 8
    property int radius: 8
    property int spacing: 8
    property int padding: 8
    property int duration: 150
    property int borderWidth: 1

    property QtObject font: QtObject {
        property string family: "FiraCode Nerd Font Mono SemBd"
        property int pointSize: 9
        readonly property int body: pointSize - 1
        readonly property int caption: pointSize - 2
    }

    property QtObject bar: QtObject {
        property int thickness: 10
        property int height: 50
    }

    property QtObject workspaces: QtObject {
        property int height: 15
        property int radius: 1000
        property real activeWidthRatio: 2.3
    }

    property QtObject cava: QtObject {
        property int width: 96
        property int height: 32
        property int innerMargin: 8
        property int barSpacing: 3
        property int barMinHeight: 2
    }

    property QtObject button: QtObject {
        property int iconSize: 14
        property int verticalPadding: 4
        property int borderWidth: 2
    }

    property QtObject tray: QtObject {
        property int iconSize: 16
    }

    property QtObject notification: QtObject {
        property int width: 420
        property int iconSize: 40
        property int textSpacing: 2
        property real bodyOpacity: 0.8
    }

    property QtObject volume: QtObject {
        property int width: 300
        property int height: 48
        property int iconSize: 22
        property int barHeight: 10
        property int timeout: 1500
        property real bottomMarginRatio: 0.2
    }
}
