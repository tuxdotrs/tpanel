# AGENTS.md

Guidance for AI agents working in this repository.

## Project Overview

**tshell** is a personal Wayland desktop shell (top bar + notification OSD) built with [Quickshell](https://quickshell.outfoxxed.me) and QML (Qt 6). It targets wlroots-based compositors via wlr-layer-shell.

## Commands

- Enter dev environment: `nix develop`
- Run the shell: `quickshell` (from repo root; entry point is `shell.qml`)
- Format Nix files: `nix fmt` (treefmt + nixfmt)

There are no tests or linters beyond the formatter.

## Tech Stack

- **Quickshell** (git, from flake input) patched `withModules` for qtbase/qtdeclarative/qtmultimedia/qttranslations
- **QML / QtQuick 6**
- **cava** — external audio visualizer process (config in `assets/cava.conf`)
- **wallust** — available in dev shell for palette generation

## Architecture

### Layered structure

```
shell.qml                 Entry point: Scope { Bar {}; Notification {} }
├── windows/              Top-level surfaces (PanelWindow roots)
│   ├── Bar.qml           Screen-edge bars + exclusive zones + corners
│   └── Notification.qml  Popup notification stack window
├── modules/              Feature widgets, grouped by surface
│   ├── bar/              Widgets placed in the bar (Clock, Workspaces,
│   │                     BatteryIndicator, AudioWidget, CavaVisualizer,
│   │                     SystemTray, LauncherButton, PowerProfileWidget,
│   │                     GhostButton)
│   └── osd/              NotificationCard.qml
├── services/             QML Singletons exposing system state
│   ├── Time.qml          SystemClock → formatted time string
│   ├── Battery.qml       UPower display device → percentage/icon
│   ├── Audio.qml         PipeWire default sink/source → device names/icons
│   ├── PowerProfile.qml  UPower power profiles → name/icon
│   ├── Cava.qml          Spawns `cava`, parses stdout into `values[]`
│   └── Notifications.qml NotificationServer: popups, DND flag, history
├── config/               QML Singletons for configuration/theming
│   ├── Theme.qml         base16 palettes (Theme.colors.base00-0F + semantic aliases), font, margin/radius/spacing/padding/duration, per-widget sizes
│   └── BarLayout.qml     Which widgets go in left/center/right bar sections
├── ui/                   Shared reusable primitives
│   ├── BarButton.qml     Themed button used by bar widgets
│   ├── RoundedCorner.qml Decorative corner piece
│   └── ExclusionZone.qml Zero-size PanelWindow reserving screen space
└── assets/               icons/, cava.conf, gallery screenshots
```

### Key patterns

- **Singletons for state and config**: everything in `services/` and `config/` is `pragma Singleton` + Quickshell `Singleton`. They are imported by directory alias (`import qs.services`, `import qs.config`, `import qs.ui`, `import qs.windows`) — never instantiate them directly.
- **One-way data flow**: `services` (reactive properties) → `modules` (presentational widgets) ← `config` (theme/layout). Windows compose modules.
- **Config-driven bar layout**: `config/BarLayout.qml` lists widget names per section; it resolves names to `.qml` file URLs under `modules/bar/`. `windows/Bar.qml` loads them dynamically through a `Repeater` of `Loader`s inside a `FlexboxLayout` (left / center / right sections). To add a bar widget: create `modules/bar/<Name>.qml`, then add `widget("<Name>")` to the desired section list.
- **Bar rendering model**: `Bar.qml` is one fullscreen transparent `PanelWindow` anchored to all edges. It draws thin colored rectangles on each edge (left/right/bottom = 10px, top = 50px), reserves compositor space via four `ExclusionZone` layer-shell windows, and punches out the screen center using a subtractive input `mask` so only the bars/corners are interactive. Rounded corners come from `ui/RoundedCorner.qml`.
- **External process service**: `services/Cava.qml` runs `cava -p assets/cava.conf` via Quickshell `Process` + `SplitParser` and republishes each line as a numeric array on `Cava.values`.
- **Notifications**: `services/Notifications.qml` implements the freedesktop `NotificationServer`; popups are tracked notifications, rendered newest-first by `windows/Notification.qml` using `modules/osd/NotificationCard.qml`. Critical notifications don't auto-expire; hover pauses the countdown timer.

## Code Conventions

- Start every QML file with `pragma ComponentBehavior: Bound` where bindings reference outer ids.
- Indentation is inconsistent across the repo (2-space in newer UI/window files, 4-space in some services); match the surrounding file when editing.
- Prefer `readonly property` for derived values; keep widgets presentational and pull all theme values from `Theme.*` rather than hardcoding colors/sizes/fonts.
- Access asset paths via `Quickshell.shellPath(...)` (see `Battery.qml`, `NotificationCard.qml`) so paths work regardless of install location.
- Commit messages follow Conventional Commits style (`feat(notifications): ...`, `refactor(bar): ...`).
