{
  description = "Flake to manage node builds";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem
    (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};
        build_inputs = with pkgs; [
          nodejs_22
        ];
        metadata = builtins.fromJSON (builtins.readFile ./package.json);
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = build_inputs;
        };
        packages = {
          default = pkgs.buildNpmPackage {
            name = metadata.name;
            buildInputs = build_inputs;
            src = self;
            npmDepsHash = "sha256-olvH0Huhz2SQDE1zfd3qGpox2MH076OilkxCvG3Af+0=";
            npmBuild = "npm run build";

            NODE_OPTIONS = "--openssl-legacy-provider";

            installPhase = ''
              mkdir $out
              cp out/* $out
            '';
          };
        };
      }
    );
}
