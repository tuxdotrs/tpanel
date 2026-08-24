pragma ComponentBehavior: Bound

import qs.services
import qs.ui

BarButton {
    id: root

    readonly property string track: Media.trackArtist !== "" ? `${Media.trackTitle} — ${Media.trackArtist}` : Media.trackTitle
    readonly property bool active: track !== ""

    visible: active
    hoverHighlight: false
    pointerCursor: false
    iconSource: Media.icon
    label: `${Media.truncateText(root.track, 28)} ${Media.position} / ${Media.length}`
}
