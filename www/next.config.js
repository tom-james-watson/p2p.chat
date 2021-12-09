const nextTranspileModules = require("next-transpile-modules");

module.exports = {
  ...nextTranspileModules(["react-github-btn"]),
  webpack(config, { isServer }) {
    if (!isServer) {
      const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }
    return config;
  },
};
