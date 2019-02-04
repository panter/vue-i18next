import deepmerge from 'deepmerge';
import { isFunction, generateId } from './utils';

const getByKey = (i18nextOptions, keyPrefix) => (key) => {
  if (keyPrefix && !key.includes(i18nextOptions.nsSeparator)) {
    return `${keyPrefix}.${key}`;
  }
  return key;
};

const getComponentNamespace = (vmOptions, i18nOptions, defaultNS, props) => {
  const ns = vmOptions.i18nOptions ? vmOptions.i18nOptions.ns : null;
  let componentNamespaces = isFunction(ns)
    ? ns(props, vmOptions)
    : ns || defaultNS;

  if (typeof componentNamespaces === 'string') { componentNamespaces = [componentNamespaces]; }

  const componentNamespace = generateId();
  return {
    componentNamespaces,
    componentNamespace,
  };
};

const getInlineTranslations = (options) => {
  let translations = {};
  if (options.__i18n) {
    translations = options.__i18n.reduce(
      (a, r) => deepmerge(a, JSON.parse(r)),
      {},
    );
  }

  if (options.i18nOptions && options.i18nOptions.messages) {
    translations = deepmerge(translations, options.i18nOptions.messages);
  }

  return translations;
};

export function beforeCreate() {
  const options = this.$options;
  if (options.i18n) {
    this._i18n = options.i18n;
  } else if (options.parent && options.parent.$i18n) {
    this._i18n = options.parent.$i18n;
  }

  if (this._i18n) {
    const {
      componentNamespace,
      componentNamespaces: cns,
    } = getComponentNamespace(
      options,
      this._i18n.options,
      this._i18n.i18next.options.defaultNS,
      this.$props,
    );

    const language =
      options.i18nOptions && options.i18nOptions.lng
        ? options.i18nOptions.lng
        : this._i18n.i18next.languages && this._i18n.i18next.languages[0];
    this.i18nReady =
      !cns ||
      (!!language &&
        cns.every(ns => this._i18n.i18next.hasResourceBundle(language, ns)));

    const initialized = () => {
      this.i18nReady = true;

      // due to emitter removing issue in i18next we need to delay remove
      setTimeout(() => {
        this._i18n.i18next.off('initialized', initialized);
      }, 1000);
    };

    if (cns) {
      this._i18n.i18next.loadNamespaces(cns, () => {
        if (!this._i18n.i18next.isInitialized) {
          this._i18n.i18next.on('initialized', initialized);
        } else {
          this.i18nReady = true;
        }
      });
    } else if (!this._i18n.i18next.isInitialized) {
      this._i18n.i18next.on('initialized', initialized);
    }

    const namespaces = [...cns, componentNamespace];
    const inlineTranslations = getInlineTranslations(options);

    // load inline translation into i18next
    Object.keys(inlineTranslations).forEach((lang) => {
      this._i18n.i18next.addResourceBundle(
        lang,
        componentNamespace,
        { ...inlineTranslations[lang] },
        true,
        false,
      );
    });

    if (options.i18nOptions) {
      // Use i18nOptions if provided
      const { lng = null } = options.i18nOptions;

      this._i18nOptions = {
        lng,
        namespaces,
      };
    } else if (options.parent && options.parent._i18nOptions) {
      // Use parent i18nOptions if there are any
      this._i18nOptions = {
        ...options.parent._i18nOptions,
        namespaces: [
          componentNamespace,
          ...options.parent._i18nOptions.namespaces,
        ],
      };
    } else if (Object.keys(inlineTranslations).length > 0) {
      // if no options are provided but there are inline translations construct the namespace
      // with the componentNamespace
      this._i18nOptions = { namespaces };
    }

    if (!this._i18nOptions) {
      this._i18nOptions = { componentNamespace, namespaces };
    } else {
      this._i18nOptions.componentNamespace = componentNamespace;
    }
  }

  // use getFixedT from i18next if options provide namespaces
  if (this._i18nOptions) {
    const { lng = null, namespaces = null } = this._i18nOptions;

    const getKey = getByKey(
      this._i18n ? this._i18n.i18next.options : {},
      options.i18nOptions && options.i18nOptions.keyPrefix,
    );

    const fixedT = this._i18n.i18next.getFixedT(lng, namespaces);
    this._t = (key, i18nextOptions) =>
      fixedT(getKey(key), i18nextOptions, this._i18n.i18nLoadedAt);
  }
}

const data = function data() {
  return { i18nReady: true };
};

export default { beforeCreate, data };
