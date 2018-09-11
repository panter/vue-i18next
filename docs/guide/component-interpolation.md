# Component interpolation

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
  resources: {
    en: { translation: locales.en }
  }
});

const i18n = new VueI18next(i18next);

Vue.component("app", {
  template: `
    <div>
      <i18next path="term" tag="label">
        <a href="#" target="_blank">{{ $t("tos") }}</a>
        <strong>{{ $t("promise") }}</strong>
      </i18next>
    </div>`
});

Vue.component("app", {
  template: `
    <div>
      <i18next path="term" tag="label">
        <a href="#" target="_blank">{{ $t("tos") }}</a>
        <strong>{{ $t("promise") }}</strong>
      </i18next>
    </div>`
});
```

```javascript
// i18next component support to specify the place

const locales = {
  en: {
    tos: "Term of Service",
    term: "I accept {{tos}}. {{promise}}.",
    promise: "I promise"
  }
};

...

Vue.component("app", {
  template: `
     <div>
      <i18next path="term" tag="label">
        <a href="#" target="_blank" place="tos">{{ $t("tos") }}</a>
        <strong place="promise">{{ $t("promise") }}</strong>
      </i18next>
    </div>`
});
```


```javascript
// i18next component support the ($t)[https://www.i18next.com/overview/api#t] options param

const locales = {
  en: {
    counter: "{{0}} dude",
    counter_plural: "{{0}} dudes"
  }
};

...

Vue.component("app", {
  template: `
    <div>
      <i18next path="term" tag="label" options="{ count: 2 }">
        <strong>Hello</strong>
      </i18next>
    </div>`
});
