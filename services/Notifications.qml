pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.Notifications

Singleton {
    id: root

    // Notifications currently shown in the OSD, tracked by the server.
    readonly property alias popups: server.trackedNotifications
    readonly property int popupCount: popups.values.length

    // Do-not-disturb: notifications are recorded but not displayed.
    property bool dnd: false

    // Maximum amount of simultaneously displayed popups.
    property int maxPopups: 5

    // History of received notifications (newest first), for future dashboards.
    property var history: []
    property int historyLimit: 100

    NotificationServer {
        id: server

        keepOnReload: false

        bodySupported: true
        bodyMarkupSupported: true
        actionsSupported: true

        onNotification: notification => {
            root.addHistory(notification);

            if (root.dnd || notification.transient)
                return;

            notification.tracked = true;

            const tracked = server.trackedNotifications.values;
            if (tracked.length > root.maxPopups)
                tracked[0].expire();
        }
    }

    function clearHistory(): void {
        root.history = [];
    }

    function addHistory(notification: Notification): void {
        const entry = {
            id: notification.id,
            appName: notification.appName,
            appIcon: notification.appIcon,
            desktopEntry: notification.desktopEntry,
            summary: notification.summary,
            body: notification.body,
            image: notification.image,
            urgency: notification.urgency,
            transient: notification.transient,
            time: Date.now(),
            actions: notification.actions.map(action => ({
                        identifier: action.identifier,
                        text: action.text
                    }))
        };

        let next = [entry, ...root.history];
        if (next.length > root.historyLimit)
            next = next.slice(0, root.historyLimit);
        root.history = next;
    }
}
