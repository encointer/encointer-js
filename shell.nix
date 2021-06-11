{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
  buildInputs = [
    nodejs-12_x
  ] ++ (with nodePackages; [
    yarn node-gyp lerna typescript-language-server
  ]);
}
