/* eslint-disable import/no-mutable-exports */
import component from './component';

export let Vue;

export function install(_Vue) {
  if (install.installed) { return; }
  install.installed = true;

  Vue = _Vue;

  Vue.mixin({
    computed: {
      $t() {
        return (key, options) => this.$i18n.t(key, options, this.$i18n.i18nLoadedAt);
      },
    },

    beforeCreate() {
      const options = this.$options;
      if (options.i18n) {
        this.$i18n = options.i18n;
      } else if (options.parent && options.parent.$i18n) {
        this.$i18n = options.parent.$i18n;
      }
    },
  });

  Vue.component(component.name, component);
}
