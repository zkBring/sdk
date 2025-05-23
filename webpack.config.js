const path = require('path')

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  target: "web",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'dist'),
    library: "ZKBringSDK",
    libraryTarget: "umd",
    globalObject: "this"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
     ".js": [".js", ".ts"],
     ".cjs": [".cjs", ".cts"],
     ".mjs": [".mjs", ".mts"]
    }
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx|js)$/,
        use: "babel-loader"
      }
    ]
  }
}