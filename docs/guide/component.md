# Component based localization

In general, locale info (e.g. `locale`,`messages`, etc) is set in the `i18next` instance and passed to the `i18n` option as root Vue instance.

Therefore you can globally translate with using `$t` in the root Vue instance and any composed component. You can also manage locale info for each component separately, which might be more convenient due to Vue components oriented design.

Component based localization example:

```js
const locales = {
  en: {
    hello: 'Hello!',
    loadbundle: 'Load bundle language: {{lang}}',
  }
};

i18next.init({
  lng: 'en',
  resources: {
    en: { translation: locales.en },
  },
});

const i18n = new VueI18next(i18next);

const Component1 = {
  template: `
    <div class="container">
      <strong>{{$t("loadbundle", {lang: this.lang}) }}</strong>
    </div>`,
  data() {
    return {
      lang: 'DE',
    };
});

new Vue({
  i18n,
  components: {
    Component1
  }
}).$mount('#app')
```

Template:

    
```html
<div id="app">
  <p>{{ $t("message.hello") }}</p>
  <component1></component1>
</div>
```

Outputs the following:

```html
<div id="app">
  <p>Hello</p>
  <div class="container">
    <strong>Load bundle language: DE</strong>
  </div>
</div>
```

As in the example above, if the component doesn't have the locale message, it falls back to globally defined localization info. The component uses the language set in the root instance (in the above example: `lng: 'en'`).
