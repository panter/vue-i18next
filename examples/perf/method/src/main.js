/* eslint-disable no-new */

import Vue from 'vue';
import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';
import App from './App.vue';

Vue.config.performance = true;
Vue.use(VueI18Next);

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        label: 'x',
      },
    },
  },
});

const i18n = new VueI18Next(i18next);

new Vue({
  el: '#app',
  i18n,
  render: h => h(App),
});
