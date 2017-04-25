/* eslint-disable no-undef, new-cap */
const locales = {
  en: {
    message: {
      hello: 'Hello!! - EN',
    },
  },

  de: {
    message: {
      hello: 'Hallo!! - DE',
    },
  },
};

i18next.init({
  lng: 'en',
  resources: {
    en: { translation: locales.en },
    //de: { translation: locales.de },
  },
});

const i18n = new VueI18next(i18next);

Vue.component('app', {
  template: "<div><language-changer /><load-bundle /><p>$t: {{ $t('message.hello') }}</p></div>",
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
