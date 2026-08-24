pragma ComponentBehavior: Bound

import QtQuick.Layouts
import qs.ui
import qs.services

RowLayout {
BarButton {
  hoverHighlight: false
  pointerCursor: false
  label: Audio.inputName
  iconSource: Audio.inputIcon
}


BarButton {
  hoverHighlight: false
  pointerCursor: false
  label: Audio.outputName
  iconSource: Audio.outputIcon
}

}

