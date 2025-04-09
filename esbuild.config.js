const { build } = require("esbuild");

build({
  entryPoints: ["./src/extension.ts"],
  outfile: "./dist/extension.js",
  bundle: true,
  platform: "node",
  sourcemap: true,
  external: ["vscode"]
}).catch(() => process.exit(1));
