pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.Mpris

Singleton {
    id: root

    readonly property MprisPlayer player: {
        const players = [...Mpris.players.values];
        return players.find(p => p.playbackState === MprisPlaybackState.Playing) ?? players[0] ?? null;
    }
    readonly property bool playing: root.player?.isPlaying ?? false
    readonly property string trackTitle: root.player?.trackTitle ?? ""
    readonly property string trackArtist: root.player?.trackArtist ?? ""
    readonly property url icon: {
        const entry = root.player?.desktopEntry ?? "";
        return entry !== "" ? Quickshell.iconPath(entry, false) : "";
    }
    readonly property string position: root.formatTime(root.player?.position ?? 0)
    readonly property string length: root.formatTime(root.player?.length ?? 0)

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
    }

    function formatTime(seconds: real): string {
        const total = Math.max(0, Math.floor(seconds));
        const minutes = Math.floor(total / 60);
        return `${minutes}:${(total % 60).toString().padStart(2, "0")}`;
    }

    // `position` does not update reactively on its own; emit the changed
    // signal every second while playing so bindings stay in sync.
    Timer {
        running: root.playing && (root.player?.positionSupported ?? false)
        interval: 1000
        repeat: true
        triggeredOnStart: true
        onTriggered: root.player?.positionChanged()
    }
}
