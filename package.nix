{
  lib,
  stdenv,
  makeWrapper,
  makeFontsConf,
  quickshellWithModules,
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
in
stdenv.mkDerivation {
  inherit version;
  pname = "tshell";
  src = lib.fileset.toSource {
    root = ./.;
    fileset = lib.fileset.unions [
      ./shell.qml
      ./assets
      ./config
      ./modules
      ./services
      ./ui
      ./windows
    ];
  };

  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ quickshellWithModules ];
  propagatedBuildInputs = runtimeDeps;

  dontBuild = true;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/bin $out/share/tshell
    cp -r . $out/share/tshell

    makeWrapper ${quickshellWithModules}/bin/qs $out/bin/tshell \
      --prefix PATH : "${lib.makeBinPath runtimeDeps}" \
      --set FONTCONFIG_FILE "${fontconfig}" \
      --add-flags "-p $out/share/tshell"

    runHook postInstall
  '';

  meta = {
    description = "tux's widgets for wayland";
    homepage = "https://github.com/tuxdotrs/tshell";
    license = lib.licenses.gpl3Only;
    mainProgram = "tshell";
    platforms = lib.platforms.linux;
  };
}
