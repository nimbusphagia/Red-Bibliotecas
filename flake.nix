{
  description = "SpringLMS frontend (Angular)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        # Active LTS; Angular 22 soporta ^22.22.3 || ^24.15.0 || >=26
        nodejs = pkgs.nodejs_26;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            nodejs
            pkgs.pnpm
            pkgs.git
          ];

          # Angular CLI pregunta por telemetría al primer uso
          NG_CLI_ANALYTICS = "false";
        };
      }
    );
}
