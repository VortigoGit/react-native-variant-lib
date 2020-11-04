[[ -z "${VARIANT}" ]] && { echo "VARIANT must be defined under Build Settings -> User-Defined" ; exit 1; } # Exits if there's no VARIANT declared
BASEDIR="$SRCROOT/../node_modules/react-native-variant-lib/variantTemplate"
echo "${VARIANT}" > "${BASEDIR}/.latest_variant.env"
