pragma ComponentBehavior: Bound

import Quickshell
import QtQuick
import QtQuick.Layouts
import Quickshell.Widgets
import qs.config
import qs.ui

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

  component BarSection: Rectangle {
    id: section

    property var widgets: []
    property int alignment: Qt.AlignLeft

    color: "transparent"
    implicitHeight: parent.height
    Layout.fillWidth: true

    Row {
      x: section.alignment === Qt.AlignLeft ? 0 : section.alignment === Qt.AlignRight ? parent.width - width : (parent.width - width) / 2
      y: (section.height - height) / 2
      spacing: Appearance.spacing

      Repeater {
        model: section.widgets

        Loader {
          required property var modelData

          source: modelData
        }
      }
    }
  }

  // Exclusions
  Scope {
    ExclusionZone {
      name: "left"
      exclusiveZone: leftBar.implicitWidth
      anchors.left: true
    }
    ExclusionZone {
      name: "top"
      exclusiveZone: topBar.implicitHeight
      anchors.top: true
    }
    ExclusionZone {
      name: "right"
      exclusiveZone: rightBar.implicitWidth
      anchors.right: true
    }
    ExclusionZone {
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

      BarSection {
        widgets: BarLayout.left
        alignment: Qt.AlignLeft
      }
      BarSection {
        widgets: BarLayout.center
        alignment: Qt.AlignHCenter
      }
      BarSection {
        widgets: BarLayout.right
        alignment: Qt.AlignRight
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

      RoundedCorner {
        required property int modelData

        corner: modelData
        color: window.barColor
      }
    }
  }
}
