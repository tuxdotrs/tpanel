import Quickshell
import Quickshell.Io
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import QtQuick.Effects
import QtQuick.Shapes
import Quickshell.Hyprland
import Quickshell.Services.SystemTray
import Quickshell.Widgets
import Quickshell.Wayland
import qs.config
import qs.services

PanelWindow {
  id: window

  property color barColor: Appearance.colors.background

  color: "transparent"
  exclusionMode: ExclusionMode.Ignore
  mask: Region {
    item: cornersArea
    intersection: Intersection.Subtract
  }

  anchors {
    left: true
    top: true
    right: true
    bottom: true
  }

  // Inline Components
  component Corner: WrapperItem {
    id: root

    property int corner
    property real radius: Appearance.radius
    property color color

    Component.onCompleted: {
      switch (corner) {
      case 0:
        anchors.left = parent.left;
        anchors.top = parent.top;
        break;
      case 1:
        anchors.top = parent.top;
        anchors.right = parent.right;
        rotation = 90;
        break;
      case 2:
        anchors.right = parent.right;
        anchors.bottom = parent.bottom;
        rotation = 180;
        break;
      case 3:
        anchors.left = parent.left;
        anchors.bottom = parent.bottom;
        rotation = -90;
        break;
      }
    }

    Shape {
      preferredRendererType: Shape.CurveRenderer

      ShapePath {
        strokeWidth: 0
        fillColor: root.color
        startX: root.radius

        PathArc {
          relativeX: -root.radius
          relativeY: root.radius
          radiusX: root.radius
          radiusY: radiusX
          direction: PathArc.Counterclockwise
        }

        PathLine {
          relativeX: 0
          relativeY: -root.radius
        }

        PathLine {
          relativeX: root.radius
          relativeY: 0
        }
      }
    }
  }
  component Exclusion: PanelWindow {
    property string name
    implicitWidth: 0
    implicitHeight: 0
    WlrLayershell.namespace: `quickshell:${name}ExclusionZone`
  }

  // Exclusions
  Scope {
    Exclusion {
      name: "left"
      exclusiveZone: leftBar.implicitWidth
      anchors.left: true
    }
    Exclusion {
      name: "top"
      exclusiveZone: topBar.implicitHeight
      anchors.top: true
    }
    Exclusion {
      name: "right"
      exclusiveZone: rightBar.implicitWidth
      anchors.right: true
    }
    Exclusion {
      name: "bottom"
      exclusiveZone: bottomBar.implicitHeight
      anchors.bottom: true
    }
  }

  // Bars
  Rectangle {
    id: leftBar
    implicitWidth: 10
    implicitHeight: QsWindow.window?.height ?? 0
    color: window.barColor
    anchors.left: parent.left
  }
  Rectangle {
    id: rightBar
    implicitWidth: 10
    implicitHeight: QsWindow.window?.height ?? 0
    color: window.barColor
    anchors.right: parent.right
  }
  Rectangle {
    id: bottomBar
    implicitWidth: QsWindow.window?.width ?? 0
    implicitHeight: 10
    color: window.barColor
    anchors.bottom: parent.bottom
  }
  Rectangle {
    id: topBar
    implicitWidth: QsWindow.window?.width ?? 0
    implicitHeight: 50
    color: window.barColor
    anchors.top: parent.top

    FlexboxLayout {
      id: flexLayout
      anchors.fill: parent
      anchors.margins: Appearance.margin

      wrap: FlexboxLayout.Wrap
      direction: FlexboxLayout.Row
      justifyContent: FlexboxLayout.JustifySpaceBetween


      Rectangle {
        color: 'transparent'
        implicitHeight: parent.height
        Layout.fillWidth: true

        Row {
          Layout.fillWidth: true
          anchors.verticalCenter: parent.verticalCenter
          anchors.left: parent.left
          spacing: Appearance.spacing

          Button {
            padding: Appearance.padding
            display: AbstractButton.IconOnly

            icon.color: Appearance.colors.foreground
            icon.source: Quickshell.shellPath("assets") + "/icons/nix.svg"
            onClicked: {
              Quickshell.execDetached(["vicinae", "toggle"]);
            }

            hoverEnabled: true

            HoverHandler {
              cursorShape: Qt.PointingHandCursor
            }

            background: Rectangle {
              anchors.fill: parent
              radius: Appearance.radius
              color: parent.hovered ? Appearance.colors.inActive : Appearance.colors.background

              Behavior on color {
                ColorAnimation {
                  duration: Appearance.duration
                }
              }
            }
          }

          Button {
            padding: Appearance.padding

            text: `${Battery.percentage}% ${Battery.energyRate}W`
            palette.buttonText: Appearance.colors.foreground
            font.family: Appearance.font.family
            font.pointSize: Appearance.font.pointSize

            icon.color: Appearance.colors.foreground
            icon.source: Battery.icon

            background: Rectangle {
              anchors.fill: parent
              radius: Appearance.radius
              color: Appearance.colors.inActive
            }
          }

          Button {
            id: cava

            padding: Appearance.padding

            readonly property int barCount: 14
            readonly property real maxValue: 100
            readonly property bool shouldVisualize: barCount > 0 && Cava.values.some(v => v >= 0.001)

            implicitWidth: 96
            implicitHeight: 32

            background: Rectangle {
              anchors.fill: parent
              radius: Appearance.radius
              color: Appearance.colors.inActive
            }

            visible: shouldVisualize

            Row {
              id: barRow

              anchors.fill: parent
              anchors.margins: 8
              spacing: 3

              Repeater {
                model: cava.barCount

                Rectangle {
                  required property int index
                  readonly property real value: Cava.values[index] ?? 0

                  width: (barRow.width - barRow.spacing * (cava.barCount - 1)) / cava.barCount
                  height: Math.max(2, (value / cava.maxValue) * barRow.height)
                  anchors.bottom: parent.bottom
                  radius: width / 2
                  color: Appearance.colors.accent
                  antialiasing: true

                  Behavior on height {
                    NumberAnimation {
                      duration: Appearance.duration
                    }
                  }
                }
              }
            }
          }
        }
      }

      Rectangle {
        color: 'transparent'
        implicitHeight: parent.height
        Layout.fillWidth: true

        Row {
          Layout.fillWidth: true
          anchors.verticalCenter: parent.verticalCenter
          anchors.horizontalCenter: parent.horizontalCenter
          spacing: Appearance.spacing

          Repeater {
            model: 7

            Rectangle {
              property var ws: Hyprland.workspaces.values.find(w => w.id === index + 1)
              property bool isActive: Hyprland.focusedWorkspace?.id === (index + 1)
              Layout.alignment: Qt.AlignVCenter
              radius: 1000
              implicitHeight: 15

              implicitWidth: isActive ? this.implicitHeight * 2.3 : this.implicitHeight

              color: {
                if (handler.hovered) {
                  return Appearance.colors.accent;
                } else if (isActive || ws) {
                  return Appearance.colors.accent;
                } else {
                  return Appearance.colors.inActive;
                }
              }

              MouseArea {
                hoverEnabled: true
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: Hyprland.dispatch("workspace " + (index + 1))
              }

              Behavior on color {
                ColorAnimation {
                  duration: Appearance.duration
                }
              }
              HoverHandler {
                id: handler
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
      }
      Rectangle {
        color: 'transparent'
        implicitHeight: parent.height
        Layout.fillWidth: true

        Row {
          Layout.fillWidth: true
          anchors.verticalCenter: parent.verticalCenter
          anchors.right: parent.right
          spacing: Appearance.spacing

          Rectangle {
            implicitWidth: sysTrayRow.implicitWidth + 10
            implicitHeight: parent.height
            radius: Appearance.radius
            color: Appearance.colors.inActive
            visible: SystemTray.items.values.length > 0

            Row {
              id: sysTrayRow

              anchors.centerIn: parent
              spacing: Appearance.spacing

              Repeater {
                model: SystemTray.items.values.length
                Image {
                  source: SystemTray.items.values[index].icon
                  height: parent.parent.height - 18
                  width: parent.parent.height - 18
                }
              }
            }
          }

          Button {
            padding: Appearance.padding
            text: Time.time

            palette.buttonText: Appearance.colors.foreground
            font.family: Appearance.font.family
            font.pointSize: Appearance.font.pointSize

            background: Rectangle {
              anchors.fill: parent
              radius: Appearance.radius
              color: Appearance.colors.inActive
            }
          }

          Button {
            padding: Appearance.padding
            display: AbstractButton.IconOnly

            icon.color: Appearance.colors.foreground
            icon.source: Quickshell.shellPath("assets") + "/icons/ghost.svg"

            hoverEnabled: true

            HoverHandler {
              cursorShape: Qt.PointingHandCursor
            }

            background: Rectangle {
              anchors.fill: parent
              radius: Appearance.radius
              color: parent.hovered ? Appearance.colors.inActive : Appearance.colors.background

              Behavior on color {
                ColorAnimation {
                  duration: Appearance.duration
                }
              }
            }
          }
        }
      }
    }

  }

  Rectangle {
    id: cornersArea
    implicitWidth: QsWindow.window?.width - (leftBar.implicitWidth + rightBar.implicitWidth)
    implicitHeight: QsWindow.window?.height - (topBar.implicitHeight + bottomBar.implicitHeight)
    color: "transparent"
    x: leftBar.implicitWidth
    y: topBar.implicitHeight

    Repeater {
      model: 4 

      Corner {
        required property int modelData
        corner: modelData
        color: window.barColor
      }
    }
  }
}


