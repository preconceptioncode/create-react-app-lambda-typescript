const webpack = require("webpack");

const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  target: "node",
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      CALENDLY_API_KEY: "NKHDOEIOIK5NVFZ7JL3LRJCZ26JX4KFX",
      PWN_API_KEY: "80402c470e297da346b164450ea5dc42",
      PWN_API_SECRET: "b42ee87e80971d747a15a7bdc34b6fd7",
      TRUEVAULT_FULL_ADMIN_KEY: "9389c2c7-8b74-4ba4-bac8-ab5defd0132f",
      TRUEVAULT_PASSWORD_RESET_TOKEN:
        "sat-d0e9ea59-f0d1-4136-b7c4-a5ecd72a195a:KrQ1mRhZKuv6wzl_oiUhshc07nWHxaUl2e4K9SGR0hg",
      TRUEVAULT_PASSWORD_RESET_FLOW_ID: "2a77b29d-fdbb-4d7a-845a-eadc79ae1615",
      INTERFAX_USERNAME: "preconception",
      INTERFAX_PASSWORD: "Fv3yKaEHNXR72yN",
      STRIPE_KEY: "sk_test_GWwxZLwqxLs7m0NtujzXGXLb00NvSYJPIx"
    })
  ]
};
