{ pkgs }: {
  deps = [
    pkgs.sudo
    pkgs.nodejs
    pkgs.less
    pkgs.nano
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}