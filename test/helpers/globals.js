
import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '../../src/i18n';
import 'babel-polyfill';

Vue.config.productionTip = false;
Vue.use(VueI18Next);

window.i18next = i18next;
window.VueI18Next = VueI18Next;
window.Vue = Vue;
