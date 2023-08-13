{ pkgs }: {
  deps = [
    pkgs.apacheHttpdPackages.php
    pkgs.nodejs-16_x
    pkgs.unzip
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}