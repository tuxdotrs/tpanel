pragma Singleton

import Quickshell
import Tshell.Cardwire

Singleton {
    id: root

    readonly property bool connected: Cardwire.connected
    readonly property CardwireGpu gpu: Cardwire.nvidiaGpu
    readonly property url icon: `${Quickshell.shellPath("assets")}/icons/nvidia.svg`
}
