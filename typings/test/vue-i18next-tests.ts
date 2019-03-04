import Vue from "vue";
import i18next from "i18next";
import VueI18Next from "../index";
import Component from "vue-class-component";

/**
 * VueI18n.install
 */
Vue.use(VueI18Next);
VueI18Next.install(Vue);

VueI18Next.version; // $ExpectType string

i18next.init({
  lng: "de",
  resources: {}
});
const i18n = new VueI18Next(i18next);
const i18nWithOptions = new VueI18Next(i18next, {});

const vm = new Vue({
  i18n
});

vm.$i18n; // $ExpectType VueI18Next
vm.$i18n.i18next; // $ExpectType i18next
vm.$t; // $ExpectType TranslationFunction

@Component({
  template: "<div><a v-on:click=\"changeLanguage('de')\">DE</a></div>"
})
class LanguageChangerComponent extends Vue {
  changeLanguage(lang: string): void {
    this.$i18n.i18next.changeLanguage(lang);
  }
}

new LanguageChangerComponent().changeLanguage("de");

Vue.component("app", {
  i18nOptions: { namespaces: "common" }
});
