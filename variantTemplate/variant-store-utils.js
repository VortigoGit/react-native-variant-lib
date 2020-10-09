const fs = require('fs');
let variant;
function getVariant() {
  return (variant || '').trim();
}

function updateFromLatestRun() {
  try {
    variant = fs
      .readFileSync(require('path').join(__dirname, '.latest_variant.env')) // Make dynamic to library
      .toString();
  } catch (e) { }
}

function variantDirectoryExists(variantPath) {
  return fs.existsSync(variantPath) && fs.lstatSync(variantPath).isDirectory();
}

updateFromLatestRun();

module.exports = {
  getVariant,
  updateFromLatestRun,
  variantDirectoryExists,
};
