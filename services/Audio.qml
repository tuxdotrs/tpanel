pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.Pipewire

Singleton {
    id: root

    readonly property string outputName: truncateText(root.displayName(Pipewire.defaultAudioSink), 14)
    readonly property string inputName: truncateText(root.displayName(Pipewire.defaultAudioSource), 14)
    readonly property url outputIcon: `${Quickshell.shellPath("assets")}/icons/speaker.svg`
    readonly property url inputIcon: `${Quickshell.shellPath("assets")}/icons/microphone.svg`

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
    }

    function displayName(node: PwNode): string {
        if (!node)
            return "none";
        return node.description || node.name;
    }

    PwObjectTracker {
        objects: [Pipewire.defaultAudioSink, Pipewire.defaultAudioSource]
    }
}
