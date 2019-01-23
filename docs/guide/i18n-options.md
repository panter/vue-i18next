# i18nOptions

## namespaces

The namepace will not be loaded automatically, see [loadComponentNamespace](/guide/started.html#init)

```javascript
const locales = {
  en: {
    tos: "Term of Service",
    term: "I accept {{0}}. {{1}}.",
    promise: "I promise"
  }
};

i18next.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { common: locales.en }
  }
});

const i18n = new VueI18next(i18next);

Vue.component("app", {
  i18nOptions: { namespaces: "common" },
  template: `
    <div>
      <i18next path="term" tag="label">
        <a href="#" target="_blank">{{ $t("tos") }}</a>
        <strong>{{ $t("promise") }}</strong>
      </i18next>
    </div>`
});
```

Namespaces can also be an array, sorted by priority.

```javascript
const common = {
  en: {
    promise: "I promise"
  }
};

const app = {
  en: {
    promise: "The app promise"
  }
};

i18next.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { common: common.en, app: app.en }
  }
});

const i18n = new VueI18next(i18next);

Vue.component("app", {
  i18nOptions: { namespaces: ["app", "common"] },
  template: `<strong>{{ $t("promise") }}</strong>`
});
```

## keyPrefix

There is also the possibility to prefix what key the component is using.

```javascript
const locales = {
  en: {
    message: {
      hello: "Hello"
    },
  }
};

i18next.init({
  ...
});

const i18n = new VueI18next(i18next);

Vue.component('app', {
  i18nOptions: { keyPrefix: 'message'},
  template: `
    <div>
      <strong>{{ $t("hello") }}</strong>
    </div>`,
});
```

## messages

Translations can not only be defined in translation files but also in the `i18nOptions`.

```javascript
i18next.init({
  ...
});

const i18n = new VueI18next(i18next);

Vue.component('app', {
  i18nOptions: {
    messages: {
      de: {
        hello: 'Hello!'
      }
    }
  },
  template: `
    <div>
      <strong>{{ $t("hello") }}</strong>
    </div>`,
});
```

## lng

Fix language in the component

```javascript
i18next.init({
  ...
});

const i18n = new VueI18next(i18next);

Vue.component('app', {
  i18nOptions: {
    lng: "de"
  },
  template: `
    <div>
      <strong>{{ $t("hello") }}</strong>
    </div>`,
});
```
