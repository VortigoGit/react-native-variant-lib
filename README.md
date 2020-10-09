# INSTALATION

npm install git+https://github.com/VortigoGit/react-native-variant-lib.git

## Android

Add this snippet on top of your `app/build.gradle`

 ``` gradle
 apply from: file("../../node_modules/react-native-variant-lib/variantTemplate/android/build.gradle"); 
 ```

## IOS

Add this line on each Build Phases -> Start Packager Schema

```sh
. ../node_modules/react-native-variant-lib/variantTemplate/ios/build.sh
```

And define a VARIANT entry on each Schema Build Settings -> User-Defined name with your variant folder 