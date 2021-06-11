{
  description = "encointer explorer";

  inputs.nixpkgs = {
    type = "github"; owner = "NixOS"; repo = "nixpkgs";
    rev = "a6b361d6276b7c413ffea0a28a1a3259d2275e2e";
  };
  inputs.utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShell = import ./shell.nix { inherit pkgs; };
      }
    );
}
