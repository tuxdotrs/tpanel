pragma ComponentBehavior: Bound

import qs.ui
import qs.services

BarButton {
  hoverHighlight: false
  pointerCursor: false
  label: Home.latency >= 0 ? `${Home.latency} ms` : "NA"
  iconSource: Home.icon
}
