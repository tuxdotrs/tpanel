pragma ComponentBehavior: Bound

import qs.ui
import qs.services

BarButton {
  hoverHighlight: false
  pointerCursor: false
  label: `${Battery.percentage}% ${Battery.energyRate}W`
  iconSource: Battery.icon
}
