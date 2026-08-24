pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.Pipewire

Singleton {
    id: root

    readonly property string outputName: root.displayName(Pipewire.defaultAudioSink)
    readonly property string inputName: root.displayName(Pipewire.defaultAudioSource)
    readonly property url outputIcon: `${Quickshell.shellPath("assets")}/icons/speaker.svg`
    readonly property url inputIcon: `${Quickshell.shellPath("assets")}/icons/microphone.svg`

    function displayName(node: PwNode): string {
        if (!node)
            return "none";
        return node.description || node.name;
    }

    PwObjectTracker {
        objects: [Pipewire.defaultAudioSink, Pipewire.defaultAudioSource]
    }
}
