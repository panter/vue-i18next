import { install, Vue } from './install';

export default class VueI18n {
  constructor(i18next, opts = {}) {
    const options = {
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      loadComponentNamespace: false,
      ...opts
    };

    this._vm = null;
    this.i18next = i18next;
    this.options = options;

    this.onI18nChanged = this.onI18nChanged.bind(this);

    if (options.bindI18n) {
      this.i18next.on(options.bindI18n, this.onI18nChanged);
    }
    if (options.bindStore && this.i18next.store) {
      this.i18next.store.on(options.bindStore, this.onI18nChanged);
    }

    this.resetVM({ i18nLoadedAt: new Date() });
  }

  resetVM(data) {
    const oldVM = this._vm;
    const { silent } = Vue.config;
    Vue.config.silent = true;
    this._vm = new Vue({ data });
    Vue.config.silent = silent;
    if (oldVM) {
      Vue.nextTick(() => oldVM.$destroy());
    }
  }

  get i18nLoadedAt() {
    return this._vm.$data.i18nLoadedAt;
  }

  set i18nLoadedAt(date) {
    this._vm.$set(this._vm, 'i18nLoadedAt', date);
  }

  t(key, options) {
    return this.i18next.t(key, options);
  }

  onI18nChanged() {
    this.i18nLoadedAt = new Date();
  }
}

VueI18n.install = install;
VueI18n.version = __VERSION__;

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueI18n);
}
