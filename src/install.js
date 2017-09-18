/* eslint-disable import/no-mutable-exports */
import component from './component';

export let Vue;

export function install(_Vue) {
  if (install.installed) { return; }
  install.installed = true;

  Vue = _Vue;

  const getByKey = i18nOptions => (key) => {
    if (i18nOptions && i18nOptions.keyPrefix) {
      return `${i18nOptions.keyPrefix}.${key}`;
    }
    return key;
  };

  Vue.mixin({
    computed: {
      $t() {
        const getKey = getByKey(this._i18nOptions);

        if (this._i18nOptions && this._i18nOptions.namespaces) {
          const { lng, namespaces } = this._i18nOptions;
          const fixedT = this.$i18n.i18next.getFixedT(lng, namespaces);
          return (key, options) => fixedT(getKey(key), options, this.$i18n.i18nLoadedAt);
        }

        return (key, options) =>
          this.$i18n.i18next.t(getKey(key), options, this.$i18n.i18nLoadedAt);
      },
    },

    beforeCreate() {
      const options = this.$options;
      if (options.i18n) {
        this.$i18n = options.i18n;
      } else if (options.parent && options.parent.$i18n) {
        this.$i18n = options.parent.$i18n;
      }

      if (this.$i18n && this.$options.i18nOptions) {
        const { lng = null, keyPrefix = null } = this.$options.i18nOptions;
        let { namespaces } = this.$options.i18nOptions;
        namespaces = namespaces || this.$i18n.i18next.options.defaultNS;
        if (typeof namespaces === 'string') namespaces = [namespaces];
        this.$i18n.i18next.loadNamespaces(namespaces);

        this._i18nOptions = { lng, namespaces, keyPrefix };
      } else if (this.$i18n && options.parent && options.parent._i18nOptions) {
        this._i18nOptions = options.parent._i18nOptions;
      }
    },
  });

  Vue.component(component.name, component);
}
