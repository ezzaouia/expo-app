const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.

  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      rule.oneOf[rule.oneOf.length - 1].exclude = [
        /\.(js|mjs|zbin|jsx|ts|tsx)$/,
        /\.html$/,
        /\.json$/,
      ];
      return {
        ...rule,
        oneOf: [
          {
            test: /zcv\.wasm$/,
            type: "javascript/auto",
            loader: "file-loader",
            options: {
              outputPath: "static/js",
              publicPath: ".",
              name: "[name].[ext]",
            },
          },
          ...rule.oneOf,
        ],
      };
    }
    return rule;
  });

  config.resolve.extensions.push(".wasm");

  return config;
};
