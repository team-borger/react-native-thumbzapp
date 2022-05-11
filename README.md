# Thumbzupp

## How to use?

1. Download or clone this repo.

2. Install dependencies.

```js
npm install
// or
yarn install
```

3. Run project on iOS / Android.

```js
 npm run ios // npm run android
 // or
 yarn ios // yarn android
```

Project was created using [Expo](https://expo.io/). If you want standard native project please run following command:

```js
expo eject
```
Expo bug fix for issue
```
Invalid regular expression: /(node_modules[\\\]react[\\\]dist[\\\].*|website\\node_modules\\.*|heapCapture\\bundle\.js|.*\\__tests__\\.*)$/: Unterminated character class
```
To fix this bug; look for `node_modules\metro-config\src\defaults\blacklist.js` and replace the values below.
##### from
```
var sharedBlacklist = [
  /node_modules[/\\]react[/\\]dist[/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];
```
##### to this
```
var sharedBlacklist = [
  /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];
```
notice the difference on line 2.
