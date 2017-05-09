/* eslint-disable no-undef, new-cap */
const locales = {
  en: {
    message: {
      hello: 'Hello!! - EN',
    },
    tos: 'Term of Service',
    term: 'I accept {{1}} {{0}}.',
  },

  de: {
    message: {
      hello: 'Hallo!! - DE',
    },
    tos: 'Geschäft',
    term: 'Ich akzeptiere {{0}}. {{1}}',
  },
};

i18next.init({
  lng: 'en',
  resources: {
    en: { translation: locales.en },
    //de: { translation: locales.de },
  },
  interpolation: {
    formatSeparator: ',',
    format(value, formatting, lng) {
      if (value instanceof Date) return 'huhu';
      return value.toString();
    },
  },
});

const i18n = new VueI18next(i18next);

Vue.component('app', {
  template: '<div><language-changer /><load-bundle /><p>$t: {{ $t("message.hello") }}</p><div><i18next path="term" tag="label" for="tos"><a href="#" target="_blank">{{ $t("tos") }}</a><strong>a</strong></i18n></i18next></div></div>',
});

Vue.component('language-changer', {
  template: '<div><a v-on:click="changeLanguage(\'de\')">DE</a>&nbsp;&nbsp;&nbsp;<a v-on:click="changeLanguage(\'en\')">EN</a></div>',
  methods: {
    changeLanguage(lang) {
      this.$i18n.i18next.changeLanguage(lang);
    },
  },
});

Vue.component('load-bundle', {
  template: '<div><a v-on:click="loadBundle">load de bundle</a></div>',
  methods: {
    loadBundle() {
      this.$i18n.i18next.addResourceBundle('de', 'translation', locales.de);
    },
  },
});

new Vue({
  i18n,
}).$mount('#app');
