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

## Init options

| Name                       | Description                                                                                                                                                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **loadComponentNamespace** | When using the [namespace options](/guide/i18n-options.md#namespaces) the namespaces will be loaded with [loadNamespaces](https://www.i18next.com/overview/api#loadnamespaces),<br>so one can lazy load namespaces for components. |
| **bindI18n**               | Listen for `i18next` events and refreshes the component.<br>Check the [i18next documentation for more infos](https://www.i18next.com/overview/api#events)                                                                          |
| **bindStore**              | Listen for `i18next` store events and refreshes the component.<br>Check the [i18next store documentation for more infos](https://www.i18next.com/overview/api#store-events)                                                        |
