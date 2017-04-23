import { install, Vue } from './install';


export default class VueI18n {
  constructor(options = {}) {
    this._vm = null;
    this.i18next = options.i18next;

    this.i18next.on('languageChanged loaded', () => {
      this.i18nLoadedAt = new Date();
    });
    this.resetVM({ i18nLoadedAt: new Date() });
  }

  resetVM(data) {
    const oldVM = this._vm;
    const silent = Vue.config.silent;
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
}

VueI18n.install = install;
VueI18n.version = '__VERSION__';

if (typeof window && window.Vue) {
  window.Vue.use(VueI18n);
}
