{
  description = "tux's widgets for wayland";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    astal,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    packages.${system} = {
      default = let
        tpanel = ags.lib.bundle {
          inherit pkgs;
          src = ./.;
          name = "tpanel";
          entry = "app.ts";
          gtk4 = true;

          extraPackages = with ags.packages.${system}; [
            hyprland
            apps
            battery
            tray
            network
          ];
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

      astal = astal.packages.${system};
    };

    apps.default = {
      type = "app";
      program = "${self.packages.${system}.default}/bin/tpanel";
    };

    devShells.${system} = {
      default = pkgs.mkShell {
        nativeBuildInputs = [
          astal.packages.${system}.default
        ];
        buildInputs = [
          # includes astal3 astal4 astal-io by default
          (ags.packages.${system}.default.override {
            extraPackages = with ags.packages.${system}; [
              hyprland
              apps
              battery
              tray
              network
            ];
          })
        ];
      };
    };
  };
}
