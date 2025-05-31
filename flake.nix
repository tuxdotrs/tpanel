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
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "tpanel";
        entry = "app.ts";
        gtk4 = true;

        extraPackages = with ags.packages.${system}; [
          hyprland
          apps
          battery
        ];
      };

      astal = astal.packages.${system};
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
            ];
          })
        ];
      };
    };
  };
}
