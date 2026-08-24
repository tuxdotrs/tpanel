{
  lib,
  stdenv,
  makeWrapper,
  makeFontsConf,
  cmake,
  ninja,
  quickshellWithModules,
  qt6,
  cava,
  wallust,
  nerd-fonts,
  extraRuntimeDeps ? [ ],
}:
let
  version = "0.1.0";

  runtimeDeps = [
    cava
    wallust
  ]
  ++ extraRuntimeDeps;

  fontconfig = makeFontsConf {
    fontDirectories = [ nerd-fonts.fira-code ];
  };

  # Unlike lib.fileset, this keeps untracked files (the flake only sees
  # git-tracked paths) while dropping build artifacts.
  src = lib.cleanSourceWith {
    src = lib.cleanSource ./.;
    filter =
      path: _:
      let
        name = baseNameOf path;
      in
      !(name == "dist" || name == "result" || name == "result-bin" || lib.hasPrefix "build" name);
  };
in
stdenv.mkDerivation {
  inherit version src;
  pname = "tshell";

  dontWrapQtApps = true;

  preConfigure = ''
    cd plugin
  '';

  nativeBuildInputs = [
    cmake
    ninja
    makeWrapper
  ];
  buildInputs = [
    qt6.qtbase
    qt6.qtdeclarative
  ];
  propagatedBuildInputs = runtimeDeps;

  postInstall = ''
    mkdir -p $out/bin $out/share/tshell

    for entry in shell.qml assets config modules services ui windows; do
      cp -r "$src/$entry" $out/share/tshell/
    done

    makeWrapper ${quickshellWithModules}/bin/qs $out/bin/tshell \
      --prefix PATH : "${lib.makeBinPath runtimeDeps}" \
      --set FONTCONFIG_FILE "${fontconfig}" \
      --suffix NIXPKGS_QT6_QML_IMPORT_PATH : "$out/lib/qt-6/qml" \
      --add-flags "-p $out/share/tshell"
  '';

  meta = {
    description = "tux's widgets for wayland";
    homepage = "https://github.com/tuxdotrs/tshell";
    license = lib.licenses.gpl3Only;
    mainProgram = "tshell";
    platforms = lib.platforms.linux;
  };
}
