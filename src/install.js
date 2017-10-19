/* eslint-disable import/no-mutable-exports */
import deepmerge from 'deepmerge';
import component from './component';

export let Vue;

export function install(_Vue) {
  if (install.installed) { return; }
  install.installed = true;

  Vue = _Vue;

  const getByKey = (i18nOptions, i18nextOptions) => (key) => {
    if (i18nOptions && i18nOptions.keyPrefix && !key.includes(i18nextOptions.nsSeparator)) {
      return `${i18nOptions.keyPrefix}.${key}`;
    }
    return key;
  };

  Vue.mixin({
    computed: {
      $t() {
        const getKey = getByKey(this._i18nOptions, this.$i18n.i18next.options);

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
      let inlineTranslations = {};

      if (this.$i18n) {
        const namespace = options.name || `${Math.random()}`;
        let namespacesToLoad = [namespace];

        if (options.__i18n) {
          options.__i18n.forEach((resource) => {
            inlineTranslations = deepmerge(inlineTranslations, JSON.parse(resource));
          });
        }

        if (this.$options.i18nOptions) {
          const { lng = null, keyPrefix = null, messages } = this.$options.i18nOptions;
          let { namespaces } = this.$options.i18nOptions;
          namespaces = namespaces || this.$i18n.i18next.options.defaultNS;

          if (typeof namespaces === 'string') namespaces = [namespaces];
          namespacesToLoad = namespaces.concat(namespacesToLoad);

          if (messages) {
            inlineTranslations = deepmerge(inlineTranslations, messages);
          }

          this._i18nOptions = { lng, namespaces: namespacesToLoad, keyPrefix };
        } else if (options.parent && options.parent._i18nOptions) {
          this._i18nOptions = options.parent._i18nOptions;
        } else if (options.__i18n) {
          this._i18nOptions = { namespaces: namespacesToLoad };
        }

        const languages = Object.keys(inlineTranslations);
        languages.forEach((lang) => {
          this.$i18n.i18next.addResourceBundle(
          lang,
          namespace,
          { ...inlineTranslations[lang] },
          true,
          false);
        });

        this.$i18n.i18next.loadNamespaces(Array.from(new Set(namespacesToLoad)));
      }
    },
  });

  Vue.component(component.name, component);
}
