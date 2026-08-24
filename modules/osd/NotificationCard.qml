pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Services.Notifications
import qs.config

Rectangle {
    id: root

    property Notification notif
    readonly property bool critical: notif?.urgency === NotificationUrgency.Critical
    readonly property int timeoutDuration: {
        const seconds = Math.round((notif?.expireTimeout ?? 0) / 1000);
        return seconds > 0 ? seconds : 5;
    }
    readonly property string iconName: {
        if (!notif)
            return "";

        const hints = notif.hints ?? {};
        const hinted = String(hints["image-path"] ?? hints["image_path"] ?? hints["icon_path"] ?? "");
        return notif.appIcon || notif.desktopEntry || hinted;
    }
    readonly property url themedIconUrl: iconName !== "" ? Quickshell.iconPath(iconName, false) : ""
    readonly property url iconUrl: `${Quickshell.shellPath("assets")}/icons/notification.svg`

    implicitWidth: 360
    implicitHeight: content.implicitHeight + Appearance.padding * 2
    radius: Appearance.radius
    color: Appearance.colors.background
    border.width: critical ? 1 : 0
    border.color: Appearance.colors.accent

    Timer {
        id: countdown

        interval: root.timeoutDuration * 1000
        repeat: false
        running: !root.critical && !hovered.hovered && visible
        onTriggered: root.notif.expire()
    }

    HoverHandler {
        id: hovered
    }

    RowLayout {
        id: content

        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.margins: Appearance.padding
        spacing: Appearance.spacing

        Item {
            width: 40
            height: 40
            Layout.alignment: Qt.AlignTop

            Image {
                anchors.fill: parent
                source: root.iconUrl
                fillMode: Image.PreserveAspectFit
                smooth: true
            }

            Image {
                anchors.fill: parent
                source: root.themedIconUrl
                visible: root.themedIconUrl !== "" && status === Image.Ready
                fillMode: Image.PreserveAspectFit
                smooth: true
            }
        }

        ColumnLayout {
            spacing: 2
            Layout.fillWidth: true
            Layout.alignment: Qt.AlignVCenter

            Text {
                text: root.notif?.appName ?? ""
                color: Appearance.colors.accent
                font.family: Appearance.font.family
                font.pointSize: Appearance.font.pointSize - 2
                elide: Text.ElideRight
                Layout.fillWidth: true
            }
            Text {
                text: root.notif?.summary ?? ""
                color: Appearance.colors.foreground
                font.family: Appearance.font.family
                font.pointSize: Appearance.font.pointSize
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                Layout.fillWidth: true
            }
            Text {
                text: root.notif?.body ?? ""
                visible: text !== ""
                color: Appearance.colors.foreground
                opacity: 0.8
                font.family: Appearance.font.family
                font.pointSize: Appearance.font.pointSize - 1
                wrapMode: Text.Wrap
                maximumLineCount: 3
                elide: Text.ElideRight
                textFormat: Text.PlainText
                Layout.fillWidth: true
            }
        }
    }
}
