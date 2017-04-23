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
    de: { translation: locales.de },
  },
});

const i18n = new VueI18next.default({
  i18next,
});

const vm = new Vue({
  i18n,
}).$mount('#app');

window.vm = vm;

setTimeout(() => {
  i18next.changeLanguage('de');
}, 3000);
