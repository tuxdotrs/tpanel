pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Shapes
import Quickshell.Widgets
import qs.config

WrapperItem {
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
