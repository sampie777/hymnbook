# Hymn book

_App name may vary on project name_

## Develop

Start development server:

```bash
yarn start
# OR
npx react-native start
```

Deploy development app onto emulator:

```bash
yarn android
# OR
npx react-native run-android
```

## Build

### Android 

```bash
cd android/
./gradlew assembleRelease 
```

Output APK's will be in `android/app/build/outputs/apk/release`. 

### IOS

No idea.

### Production build

Create keystore in `android/`.
```bash
keytool -genkey -v -storetype PKCS12 -keystore hymnbook.keystore -alias hymnbookKey -keyalg RSA -keysize 2048 -validity 10000
```

Make sure keystore is correctly defined in:
`android/gradle.properties`.

## To do

- Match Android font families with IOS families.

