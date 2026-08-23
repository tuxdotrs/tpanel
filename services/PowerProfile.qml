pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.UPower as UPower

Singleton {
    id: root

    readonly property bool performanceAvailable: UPower.PowerProfiles.hasPerformanceProfile
    readonly property string name: {
        switch (UPower.PowerProfiles.profile) {
        case UPower.PowerProfile.Performance:
            return "Performance";
        case UPower.PowerProfile.PowerSaver:
            return "Power Saver";
        default:
            return "Balanced";
        }
    }
    readonly property url icon: `${Quickshell.shellPath("assets")}/icons/power.svg`
}
