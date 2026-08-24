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
        ];
      };
    };
}
