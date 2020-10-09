const fs = require("fs");
const path = require("path");
const { getVariant } = require("./variant-store-utils");

const normalize = (androidBasePath) => {
  const variantArg = process.argv.find((a) => a.includes("--variant="));
  if (process.argv.find((a) => a === "run-ios")) {
    process.argv = process.argv.filter((a) => !a.includes("--variant="));
  }
  if (process.argv.includes("run-android")) {
    process.argv.push("--no-packager"); //We disable the packager and migrate the packager start to the gradle task
    // If the variant is defined
    const variantName = variantArg
      ? variantArg.split("=")[1] || getVariant()
      : getVariant();
    if (variantName) {
      const packageName = fs
        .readFileSync(
          path.join(androidBasePath, "android", "app", "src", "main", "AndroidManifest.xml"), 
          "utf8",
        )
        // $FlowFixMe
        .match(/package="(.+?)"/)[1];
      process.argv.push(
        `--appId=${packageName}`.replace(
          /.[a-zA-Z]+$/,
          "." + variantName.replace("Release", ""),
        ),
      );
    }

    if (variantName && !variantName.endsWith("Release")) {
      process.argv[process.argv.indexOf(variantArg)] =
        "--variant=" + variantName + "Debug";
    } else if (!variantArg && getVariant()) {
      process.argv.push("--variant=" + getVariant() + "Debug");
    }
  }
}

module.exports = normalize;