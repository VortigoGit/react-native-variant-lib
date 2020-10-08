const variant = require("./variant-store-utils").getVariant;

function babelVariantSetup(basePath) {
  require("tsconfig-paths").register({
    baseUrl: basePath,
    paths: {
      "@Params": [`${basePath}/${variant()}/*`, `${basePath}/src/*`],
      "@Strings": [`${basePath}/${variant()}/*`, `${basePath}/src/*`],
      "@App/*": [`${basePath}/${variant()}/*`, `${basePath}/src/*`],
      "@Base/*": [`${basePath}/src/*`],
    },
  });
  require("ts-node").register({
    files: ["../__types__/parameters.d.ts"],
  });

  module.exports = function (api) {
    api.cache(true);
    return {
      plugins: [
        [
          require.resolve("babel-plugin-module-resolver"),
          {
            alias: {
              "^@Base/(.*)": ([, path]) => `${basePath}/src/${path}`,
              "@Params": () =>
                variant()
                  ? [`${basePath}/${variant()}/parameters`, `${basePath}/src/parameters`]
                  : `${basePath}/src/parameters`,
              "@Strings": () =>
                variant()
                  ? [`${basePath}/${variant()}/strings`, `${basePath}/src/strings`]
                  : `${basePath}/src/strings`,
              "^@App/(.+)": ([, path]) =>
                variant()
                  ? [`${basePath}/${variant()}/${path}`, `${basePath}/src/${path}`]
                  : `${basePath}/src/${path}`,
            },
            extensions: [
              ".ios.js",
              ".android.js",
              ".js",
              ".ts",
              ".tsx",
              ".json",
              ".png",
            ],
          },
        ],
        [
          "module:react-native-dotenv",
          {
            path: `${basePath}/${variant()}/.env`,
          },
        ],
        [
          "react-native-conditional-compile",
          {
            define: () => require("@App/parameters").VariantParameters,
          },
        ],
      ],
      presets: ["module:metro-react-native-babel-preset"],
    };
  };
}