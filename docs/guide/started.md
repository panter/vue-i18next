# Getting started

Source can be loaded via

```
# npm package
$ npm install @panter/vue-i18next
```

## Requirements

* vue >= **2.0.0**
* i18next >= **6.0.1**

## Init

```javascript
import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';

Vue.use(VueI18Next);

i18next.init({
  lng: 'de',
  resources: {
    ...
  }
});

const i18n = new VueI18Next(i18next);
new Vue({
  ...
  i18n: i18n,
});
```
