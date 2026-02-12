{
  description = "tux's widgets for wayland";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    pname = "tpanel";
    entry = "app.ts";

    agsPackages = with ags.packages.${system}; [
      io
      astal4
      hyprland
      apps
      battery
      tray
      network
      notifd
      wireplumber
      cava
    ];

    extraPackages =
      agsPackages
      ++ [
        pkgs.libadwaita
      ];
  in {
    packages.${system} = {
      default = let
        tpanel = pkgs.stdenv.mkDerivation {
          name = pname;
          src = ./.;

          nativeBuildInputs = with pkgs; [
            wrapGAppsHook3
            gobject-introspection
            ags.packages.${system}.default
          ];

          buildInputs = extraPackages ++ [pkgs.gjs];

          installPhase = ''
            runHook preInstall

            mkdir -p $out/bin
            mkdir -p $out/share
            cp -r * $out/share
            ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

            runHook postInstall
          '';

          # Remove any broken symlinks
          postFixup = ''
            find $out -type l ! -exec test -e {} \; -delete 2>/dev/null || true
          '';
        };
      in
        pkgs.runCommand "tpanel" {
          nativeBuildInputs = [pkgs.makeWrapper];
        } ''
          mkdir -p $out/bin

          # Copy the bundled app
          cp -r ${tpanel}/* $out/

          mv $out/bin/tpanel $out/bin/.tpanel-unwrapped

          makeWrapper $out/bin/.tpanel-unwrapped $out/bin/tpanel \
            --run 'ICONS_DIR="$HOME/.config/tpanel/assets/icons"

                  # Check if icons directory needs to be set up
                  if [ ! -d "$ICONS_DIR" ]; then
                    # Create necessary directories
                    mkdir -p "$ICONS_DIR"

                    # Copy icon files if source exists and destination is empty
                    if [ -d "'"$out"'/share/assets/icons" ]; then
                      cp -r "'"$out"'/share/assets/icons/"* "$ICONS_DIR/"
                      echo "Installed tpanel icons to $ICONS_DIR"
                    fi
                  fi'

        '';

      ags = ags.packages.${system};
    };

    apps.default = {
      type = "app";
      program = "${self.packages.${system}.default}/bin/tpanel";
    };

    devShells.${system} = {
      default = pkgs.mkShell {
        buildInputs = [
          (ags.packages.${system}.default.override {
            inherit extraPackages;
          })
        ];
      };
    };
  };
}
