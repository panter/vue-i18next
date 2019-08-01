# Directives

## v-t

Full Featured properties:

* `path`: string
* `language`: language, optional
* `args`: object

```javascript
const locales = {
  en: {
    hello: "Hello",
    helloWithName: "Hello {{name}}"
  }
};

i18next.init({
  lng: "en",
  resources: {
    en: { translation: locales.en }
  }
});

const i18n = new VueI18next(i18next);

// simple usage
Vue.component("app", {
  template: `<p v-t="'hello'"></p>`
});

// full featured
Vue.component("app", {
  template: `<p ref="text" v-t="{ path: 'helloWithName', language: 'en', args: { name: 'Hans' } }"></p>`
});
```


## v-waitForT

Wait for the i18next fot be initialized. If not initialized it sets the element to `hidden = true` and wait 
for i18next to be initialized.

```javascript
const locales = {
  en: {
    hello: "Hello"
  }
};

i18next.init({
  lng: "en",
  resources: {
    en: { translation: locales.en }
  }
});

const i18n = new VueI18next(i18next);

Vue.component("app", {
  template: `<p v-waitForT>$t("hello")</p>`
});
```
