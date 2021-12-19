const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["react-github-btn"]);

module.exports = withPlugins([withTM], {
  webpack(config, { isServer }) {
    if (!isServer) {
      const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }
    return config;
  },
  productionBrowserSourceMaps: true,
});
