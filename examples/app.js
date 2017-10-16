/* eslint-disable no-undef, new-cap */
const locales = {
  en: {
    message: {
      hello: 'Hello!! - EN',
    },
    tos: 'Term of Service',
    term: 'I accept {{1}} {{0}}.',
    loadbundle: 'Load Bundle {{lang}}',
  },

  de: {
    message: {
      hello: 'Hallo!! - DE',
    },
    tos: 'Nutzungsbedingungen',
    term: 'Ich akzeptiere {{0}}. {{1}}',
    loadbundle: 'Bundle Laden {{lang}}',
  },
};

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: locales.en },
  },
});

const i18n = new VueI18next(i18next);

Vue.component('app', {
  template: `
    <div>
      <div>
        <h3>Translation</h3>
        <language-changer></language-changer><load-bundle></load-bundle>
        <p>$t: {{ $t("message.hello") }}</p>
      </div>
      <div>
        <h3>Interpolation</h3>
        <i18next path="term" tag="label" for="tos">
          <a href="#" target="_blank">{{ $t("tos") }}</a>
          <strong>a</strong>
        </i18next>
      </div>
      <div>
        <h3>Prefix</h3>
        <key-prefix></key-prefix>
      </div>
      <div>
        <h3>Interpolation</h3>
        <inline-translations></inline-translations>
      </div>
    </div>`,
});

Vue.component('language-changer', {
  template: `
    <div>
      <a v-on:click="changeLanguage('de')">DE</a>
      &nbsp;|&nbsp;
      <a v-on:click="changeLanguage('en')">EN</a>
    </div>`,
  methods: {
    changeLanguage(lang) {
      this.$i18n.i18next.changeLanguage(lang);
    },
  },
});

Vue.component('load-bundle', {
  template: `
    <div>
      <a v-on:click="loadBundle">{{$t("loadbundle", {lang: this.lang}) }}</a>
    </div>`,
  data() {
    return {
      lang: 'DE',
    };
  },
  methods: {
    loadBundle() {
      this.$i18n.i18next.addResourceBundle('de', 'translation', locales.de);
    },
  },
});

Vue.component('key-prefix', {
  i18nOptions: {
    keyPrefix: 'message',
  },
  template: `
    <div>
      <p>{{$t('hello')}}</p>
    </div>`,
});

Vue.component('inline-translations', {
  i18nOptions: {
    messages: {
      en: {
        welcome: 'Welcome!',
      },
      de: {
        welcome: 'Guten Tag!',
      },
    },
  },
  template: `
    <div>
      {{$t('welcome')}}
    </div>`,
});

new Vue({
  i18n,
}).$mount('#app');
