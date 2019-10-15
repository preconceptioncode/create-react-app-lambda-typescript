const webpack = require("webpack");

const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  target: "node",
  externals: [nodeExternals()],
  plugins: [new webpack.DefinePlugin({ "global.GENTLY": false })]
};
