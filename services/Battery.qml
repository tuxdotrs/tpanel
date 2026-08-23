pragma Singleton

import Quickshell
import QtQuick
import Quickshell.Services.UPower

Singleton {
    id: root
    readonly property int percentage: Math.round(UPower.displayDevice.percentage * 100)
    readonly property real energyRate: UPower.displayDevice.changeRate
    readonly property string iconName: root.percentage < 30 ? "battery-low.svg" : root.percentage < 70 ? "battery-medium.svg" : "battery-full.svg"
    readonly property url icon: `${Quickshell.shellPath("assets")}/icons/${root.iconName}`
}
