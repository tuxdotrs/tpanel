<h3 align="center">
  tux's panel
</h3>
<p align="center">
  <a href="https://wakatime.com/badge/user/012e8da9-99fe-4600-891b-bd9d8dce73d9/project/78c29f20-90c3-4f22-a3b6-a83724f8e97e"><img src="https://wakatime.com/badge/user/012e8da9-99fe-4600-891b-bd9d8dce73d9/project/78c29f20-90c3-4f22-a3b6-a83724f8e97e.svg" alt="wakatime"></a>
  <a href="https://builtwithnix.org" target="_blank"><img alt="home" src="https://img.shields.io/static/v1?logo=nixos&logoColor=white&label=&message=Built%20with%20Nix&color=41439a"></a>
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/tuxdotrs/tpanel">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/tuxdotrs/tpanel">
</p>

![image](https://github.com/user-attachments/assets/a381b06c-618a-4a9e-b2ac-d6effa4f9069)

## Installation

Quick

```nix
# If you want to quickly test out tpanel
nix run github:tuxdotrs/tpanel
```

Flake

```nix
# Add to your flake inputs
tpanel = {
  url = "github:tuxdotrs/tpanel";
  inputs.nixpkgs.follows = "nixpkgs";
};

# Add this in your nixos config
environment.systemPackages = [ inputs.tpanel.packages.${system}.default ];

# Add this in your HomeManager config
home.packages = [ inputs.tpanel.packages.${system}.default ];
```
