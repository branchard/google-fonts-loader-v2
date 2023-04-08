# Google Fonts Loader v2

[![npm version](https://badgen.net/npm/v/google-fonts-loader-v2)](https://npm.im/google-fonts-loader-v2)
[![npm downloads](https://badgen.net/npm/types/google-fonts-loader-v2)](https://npm.im/google-fonts-loader-v2)
[![npm downloads](https://badgen.net//bundlephobia/dependency-count/google-fonts-loader-v2)](https://bundlephobia.com/package/google-fonts-loader-v2)
[![npm downloads](https://badgen.net/bundlephobia/minzip/google-fonts-loader-v2)](https://bundlephobia.com/package/google-fonts-loader-v2)

A [Google Fonts](https://fonts.google.com) library specifically designed for the [v2 API](https://developers.google.com/fonts/docs/css2) and [variable fonts](https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts), which helps to load them in the **browser**.

## 🎯 Features
- Google Fonts v2 API
- Variable fonts
- Promise that await for a font to be fully loaded
- List loaded fonts
- Unloading fonts
- Type safe/Typescript support

## ⚙️ Install
```shell
npm install google-fonts-loader-v2
# or
yarn add google-fonts-loader-v2
# or
pnpm add google-fonts-loader-v2
# or
bun add google-fonts-loader-v2
```

## 📖 Usage
```javascript
import {loadAwait, list, unload} from "google-fonts-loader-v2";

console.log("Loading Open Sans…");
await loadAwait({
    family: "Open Sans",
    axisTupleList: [
        [
            {tag: "ital", value: 0},
            {tag: "wght", value: 500},
        ],
        [
            {tag: "ital", value: 1},
            {tag: "wght", value: 500},
        ],
    ],
}, {
    display: "swap",
});
console.log("Open Sans loaded!");

console.log(`${list().length} fonts loaded!`);

console.log("Unloading Open Sans…");
unload({
    family: "Open Sans",
});
console.log("Open Sans unloaded!");
```

## 📚 Documentation
### load()
```typescript
load(font: Font, options?: Options): void
```
Just load the given font in the curent page.

### loadAwait()
```typescript
loadAwait(font: Font, options?: Options): Promise<void>
```
Load the given font and return a promise that resolve when the font is fully loaded.

### list()
```typescript
list(): Font[]
```
List the currently loaded fonts.

### unload()
```typescript
unload(font: Font): void
```
Unload the given font family.

### unloadAll()
```typescript
unloadAll(): void
```
Unload all the previously loaded fonts.

## 🐜 Known bugs

- https://fonts.googleapis.com/css2?family=Nabla:EHLT@5;12&display=swap seems to return 400 code while this query should be valid
