/* eslint-disable import/no-mutable-exports */
import deepmerge from 'deepmerge';
import component from './component';
import directive from './directive';
import waitDirective from './wait';

export let Vue;

export function install(_Vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  Vue = _Vue;

  const getByKey = (i18nOptions, i18nextOptions) => (key) => {
    if (
        i18nOptions &&
        i18nOptions.keyPrefix &&
        !key.includes(i18nextOptions.nsSeparator)
      ) {
      return `${i18nOptions.keyPrefix}.${key}`;
    }
    return key;
  };

  const getComponentNamespace = (vm) => {
    const namespace = vm.$options.name || vm.$options._componentTag;
    if (namespace) {
      return {
        namespace,
        loadNamespace: true,
      };
    }

    return {
      namespace: `${Math.random()}`,
    };
  };

  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      if (options.i18n) {
        this._i18n = options.i18n;
      } else if (options.parent && options.parent.$i18n) {
        this._i18n = options.parent.$i18n;
      }
      let inlineTranslations = {};

      if (this._i18n) {
        const getNamespace =
          this._i18n.options.getComponentNamespace || getComponentNamespace;
        const { namespace, loadNamespace } = getNamespace(this);

        if (options.__i18n) {
          options.__i18n.forEach((resource) => {
            inlineTranslations = deepmerge(
              inlineTranslations,
              JSON.parse(resource),
            );
          });
        }

        if (options.i18nOptions) {
          const {
            lng = null,
            keyPrefix = null,
            messages,
          } = this.$options.i18nOptions;
          let { namespaces } = this.$options.i18nOptions;
          namespaces = namespaces || this._i18n.i18next.options.defaultNS;

          if (typeof namespaces === 'string') namespaces = [namespaces];
          const namespacesToLoad = namespaces.concat([namespace]);

          if (messages) {
            inlineTranslations = deepmerge(inlineTranslations, messages);
          }

          this._i18nOptions = { lng, namespaces: namespacesToLoad, keyPrefix };
          this._i18n.i18next.loadNamespaces(namespaces);
        } else if (options.parent && options.parent._i18nOptions) {
          this._i18nOptions = { ...options.parent._i18nOptions };
          this._i18nOptions.namespaces = [
            namespace,
            ...this._i18nOptions.namespaces,
          ];
        } else if (options.__i18n) {
          this._i18nOptions = { namespaces: [namespace] };
        }

        if (loadNamespace && this._i18n.options.loadComponentNamespace) {
          this._i18n.i18next.loadNamespaces([namespace]);
        }

        const languages = Object.keys(inlineTranslations);
        languages.forEach((lang) => {
          this._i18n.i18next.addResourceBundle(
            lang,
            namespace,
            { ...inlineTranslations[lang] },
            true,
            false,
          );
        });
      }

      const getKey = getByKey(
          this._i18nOptions,
          this._i18n ? this._i18n.i18next.options : {},
        );

      if (this._i18nOptions && this._i18nOptions.namespaces) {
        const { lng, namespaces } = this._i18nOptions;

        const fixedT = this._i18n.i18next.getFixedT(lng, namespaces);
        this._getI18nKey = (key, i18nextOptions) =>
            fixedT(getKey(key), i18nextOptions, this._i18n.i18nLoadedAt);
      } else {
        this._getI18nKey = (key, i18nextOptions) =>
          this._i18n.t(getKey(key), i18nextOptions, this._i18n.i18nLoadedAt);
      }
    },
  });

  // extend Vue.js
  if (!Object.prototype.hasOwnProperty.call(Vue, '$i18n')) {
    Object.defineProperty(Vue.prototype, '$i18n', {
      get() { return this._i18n; },
    });
  }

  Vue.prototype.$t = function t(key, options) {
    return this._getI18nKey(key, options);
  };

  Vue.component(component.name, component);
  Vue.directive('t', directive);
  Vue.directive('waitForT', waitDirective);
}
