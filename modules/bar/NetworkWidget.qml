pragma ComponentBehavior: Bound

import qs.ui
import qs.services

BarButton {
    hoverHighlight: false
    pointerCursor: false
    label: Network.statusText
    iconSource: Network.icon
}
