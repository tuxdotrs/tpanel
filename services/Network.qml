pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Networking

Singleton {
    id: root

    readonly property url icon: `${Quickshell.shellPath("assets")}/icons/network.svg`

    property var wifiDevice: {
        for (const device of Networking.devices.values) {
            if (device.type === DeviceType.Wifi)
                return device;
        }
        return null;
    }

    property var wiredDevice: {
        for (const device of Networking.devices.values) {
            if (device.type === DeviceType.Wired)
                return device;
        }
        return null;
    }

    readonly property bool ethernetConnected: !!(root.wiredDevice && root.wiredDevice.connected)

    readonly property bool wifiConnected: !!(root.wifiDevice && root.wifiDevice.connected)

    readonly property bool wifiConnecting: !!(root.wifiDevice && root.wifiDevice.state === ConnectionState.Connecting)

    property var activeNetwork: null

    function refreshActiveNetwork() {
        root.activeNetwork = null;

        if (!root.wifiDevice || !root.wifiDevice.networks)
            return;

        for (const network of root.wifiDevice.networks.values) {
            if (network.connected) {
                root.activeNetwork = network;
                return;
            }
        }
    }

    readonly property string statusText: {
        if (root.ethernetConnected)
            return "Wired";

        if (root.wifiConnecting)
            return "Connecting";

        if (root.wifiConnected && root.activeNetwork)
            return root.activeNetwork.name;

        return "NA";
    }

    Connections {
        target: root.wifiDevice ? root.wifiDevice.networks : null

        function onValuesChanged() {
            root.refreshActiveNetwork();
        }
    }

    Timer {
        interval: 1000
        running: true
        repeat: true
        triggeredOnStart: true

        onTriggered: {
            root.refreshActiveNetwork();
        }
    }
}
