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
        if (this.$options.i18nOptions) {
          const { lng = null } = this.$options.i18nOptions;
          let { namespaces } = this.$options.i18nOptions;
          namespaces = namespaces || this.$i18n.i18next.options.defaultNS;
          if (typeof namespaces === 'string') namespaces = [namespaces];
          this.$i18n.i18next.loadNamespaces(namespaces);

          const fixedT = this.$i18n.i18next.getFixedT(lng, namespaces);
          return (key, options) => fixedT(key, options, this.$i18n.i18nLoadedAt);
        }
        return (key, options) => this.$i18n.i18next.t(key, options, this.$i18n.i18nLoadedAt);
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
