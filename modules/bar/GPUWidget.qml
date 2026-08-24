pragma ComponentBehavior: Bound

import Quickshell
import qs.config
import qs.ui
import qs.services

BarButton {
    id: root

    hoverHighlight: false
    pointerCursor: false
    iconSource: GPU.icon

    visible: GPU.connected && GPU.gpu !== null
    opacity: GPU.gpu !== null && GPU.gpu.known ? 1 : 0

    label: {
        if (!GPU.gpu)
            return "NA";
        return GPU.gpu.blocked ? "Blocked" : "Active";
    }
}
