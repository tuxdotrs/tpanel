pragma ComponentBehavior: Bound

import Quickshell
import qs.ui

BarButton {
  iconOnly: true
  iconSource: `${Quickshell.shellPath("assets")}/icons/nix.svg`
  onClicked: Quickshell.execDetached(["vicinae", "toggle"])
}
