const fs = require("fs");
const path = require("path");
const {
  getVariant,
  updateFromLatestRun,
  variantDirectoryExists,
} = require("./variant-store-utils");
const IncrementalBundler = require("metro/src/IncrementalBundler");

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

function buildMetro(basePath) {
  const filePath = path.join(basePath, `${getVariant()}`);
  const folderExists = variantDirectoryExists(filePath);
  return {
    cacheVersion: getVariant() || "default",
    watchFolders: folderExists ? [filePath] : [],
    server: {
      enhanceMiddleware: function CustomMiddleware(m, s) {
        return (req, res, next) => {
          const prevVariant = getVariant();
          updateFromLatestRun();
          const currentVariant = getVariant();
          // When external change has been detect
          if (prevVariant !== getVariant()) {
            const [prevFolder, currFolder] = [
              prevVariant,
              currentVariant,
            ].map((a) => path.join(basePath, a));
            const indexOfPrev = s._config.watchFolders.indexOf(prevFolder);
            if (indexOfPrev !== -1) s._config.watchFolders.splice(indexOfPrev, 1);
            if (variantDirectoryExists(currFolder))
              s._config.watchFolders.push(currFolder);
            // Clear caches from metro bundles
            s._config.cacheStores.forEach(s => s.clear());
            s._config.reporter.update({ type: "transform_cache_reset" });
            // Replace the bundler so it can build all the project again
            s._bundler = new IncrementalBundler(
              {
                ...s._config,
                cacheVersion: getVariant(),
              },
              {
                hasReducedPerformance: s._serverConfig && s._serverConfig.hasReducedPerformance,
                watch: s._serverConfig ? s._serverConfig.watch : undefined,
              }
            );
          }
          // Let the metro default handle request
          return m(req, res, next);
        };
      },
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  };
}

module.exports = buildMetro;