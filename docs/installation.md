# Installation

## Compatibility Note

- Vue.js `2.0.0`+

## Direct Download / CDN

<https://unpkg.com/@panter/vue-i18next/dist/vue-i18next.js>

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like <https://unpkg.com/@panter/vue-i18next@0.12.0/dist/vue-i18next.js>

Include vue-i18next after Vue and it will install itself automatically:

    
```html    
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/i18next@8.0.0/i18next.js"></script>
<script src="https://unpkg.com/@panter/vue-i18next/dist/vue-i18next.js"></script>
```

## NPM
    
```sh
npm install @panter/vue-i18next
``` 

## Yarn
    
```sh
yarn add @panter/vue-i18next
```

When using with a module system, you must explicitly install the `vue-i18next`
via `Vue.use()`:

    
```javascript
import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';

Vue.use(VueI18Next);
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `@panter/vue-i18next` yourself if you want to use the latest dev build.

```sh
git clone https://github.com/@panter/vue-i18next.git node_modules/@panter/vue-i18next
cd node_modules/@panter/vue-i18next
yarn
yarn build 
```
