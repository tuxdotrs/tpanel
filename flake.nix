{
  description = "tux's widgets for wayland";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    quickshell = {
      url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      quickshell,
      treefmt-nix,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};

      quickshellWithModules = quickshell.packages.${system}.default.withModules [
        pkgs.qt6.qtbase
        pkgs.qt6.qtdeclarative
        pkgs.qt6.qtmultimedia
        pkgs.qt6.qttranslations
      ];

      treefmtEval = treefmt-nix.lib.evalModule pkgs {
        projectRootFile = "flake.nix";

        programs = {
          nixfmt.enable = true;
          qmlformat.enable = true;
          clang-format.enable = true;
        };
      };
    in
    rec {
      formatter.${system} = treefmtEval.config.build.wrapper;

      packages.${system} = {
        tshell = pkgs.callPackage ./package.nix {
          inherit quickshellWithModules;
        };
        default = packages.${system}.tshell;
      };

      devShells.${system}.default = pkgs.mkShell {
        packages = [
          quickshellWithModules
          pkgs.cava
          pkgs.wallust
          pkgs.dbus
          pkgs.cmake
          pkgs.ninja
          pkgs.qt6.qtbase
          pkgs.qt6.qtdeclarative
        ];

        shellHook = ''
          if [ -d "$PWD/plugin/dist/lib/qt-6/qml" ]; then
            export NIXPKGS_QT6_QML_IMPORT_PATH="$PWD/plugin/dist/lib/qt-6/qml''${NIXPKGS_QT6_QML_IMPORT_PATH:+:$NIXPKGS_QT6_QML_IMPORT_PATH}"
            export QML2_IMPORT_PATH="$PWD/plugin/dist/lib/qt-6/qml''${QML2_IMPORT_PATH:+:$QML2_IMPORT_PATH}"
          else
            echo "gpu plugin is not built; run from the repo root to enable 'import Tshell.Cardwire':"
            echo "  cmake -S plugin -B plugin/dist -DCMAKE_INSTALL_PREFIX=\$PWD/plugin/dist"
            echo "  cmake --build plugin/dist --target install"
          fi
        '';
      };
    };
}
