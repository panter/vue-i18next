import deepmerge from 'deepmerge';
import { isFunction, generateId } from './utils';

const getByKey = (i18nextOptions, keyPrefix) => key => {
  if (keyPrefix && !key.includes(i18nextOptions.nsSeparator)) {
    return `${keyPrefix}.${key}`;
  }
  return key;
};

const getNamespaces = (vmOptions, defaultNS) => {
  const ns = vmOptions.i18nOptions ? vmOptions.i18nOptions.ns : null;
  const componentNamespaces = isFunction(ns) ? ns(vmOptions) : ns || defaultNS;

  return typeof componentNamespaces === 'string'
    ? [componentNamespaces]
    : componentNamespaces;
};

const loadInlineTranslations = (options, componentNamespace, i18next) => {
  let translations = {};
  if (options.__i18n) {
    translations = options.__i18n.reduce(
      (a, r) => deepmerge(a, JSON.parse(r)),
      {}
    );
  }

  if (options.i18nOptions && options.i18nOptions.messages) {
    translations = deepmerge(translations, options.i18nOptions.messages);
  }

  const keys = Object.keys(translations);
  keys.forEach(lang => {
    i18next.addResourceBundle(
      lang,
      componentNamespace,
      { ...translations[lang] },
      true,
      false
    );
  });

  return keys.length > 0;
};

const geti18nOptions = (options, componentNamespace, namespaces) => {
  if (options.i18nOptions) {
    // Use i18nOptions if provided
    const { lng = null } = options.i18nOptions;
    return {
      componentNamespace,
      lng,
      namespaces: [...namespaces, componentNamespace]
    };
  }
  if (options.parent && options.parent._i18nOptions) {
    // Use parent i18nOptions if there are any
    return {
      ...options.parent._i18nOptions,
      namespaces: [
        componentNamespace,
        ...options.parent._i18nOptions.namespaces
      ],
      componentNamespace
    };
  }
  return {
    componentNamespace,
    namespaces: [...namespaces, componentNamespace]
  };
};

const loadNamespaces = (namespaces, i18next, cb) => {
  const initialized = () => {
    cb();

    // due to emitter removing issue in i18next we need to delay remove
    setTimeout(() => {
      i18next.off('initialized', initialized);
    }, 1000);
  };

  i18next.loadNamespaces(namespaces, () => {
    if (!i18next.isInitialized) {
      i18next.on('initialized', initialized);
    } else {
      cb();
    }
  });
};

function beforeCreate() {
  const options = this.$options;
  if (options.i18n) {
    this._i18n = options.i18n;
  } else if (options.parent && options.parent.$i18n) {
    this._i18n = options.parent.$i18n;
  }

  if (this._i18n) {
    const { i18next } = this._i18n;
    const componentNamespace = generateId();
    const componentNamespaces = getNamespaces(
      options,
      i18next.options.defaultNS
    );

    const language =
      options.i18nOptions && options.i18nOptions.lng
        ? options.i18nOptions.lng
        : i18next.languages && i18next.languages[0];

    loadInlineTranslations(options, componentNamespace, i18next);

    this._i18nOptions = geti18nOptions(
      options,
      componentNamespace,
      componentNamespaces
    );
    this._i18nOptions.defaultLanguage = language;
    this._i18nOptions.defaultNamespaces = componentNamespaces;

    const { lng = null, namespaces = null } = this._i18nOptions;
    const getKey = getByKey(
      this._i18n.i18next.options,
      options.i18nOptions && options.i18nOptions.keyPrefix
    );

    const fixedT = this._i18n.i18next.getFixedT(lng, namespaces);
    this._t = (key, i18nextOptions) =>
      fixedT(getKey(key), i18nextOptions, this._i18n.i18nLoadedAt);
  }
}

function created() {
  if (this._i18nOptions) {
    const options = this.$options;
    const { i18next } = this._i18n;
    const namespaces = this._i18nOptions.defaultNamespaces;
    const language = this._i18nOptions.defaultLanguage;

    this.$data.$i18nReady =
      !namespaces ||
      (!!language &&
        namespaces.every(ns => i18next.hasResourceBundle(language, ns)));

    if (namespaces && (options.i18nOptions || !options.parent)) {
      loadNamespaces(namespaces, i18next, () => {
        this.$data.$i18nReady = true;
      });
    }

    Object.defineProperty(this, '$i18nReady', {
      get: () => this.$data.$i18nReady
    });
  }
}

const data = function data() {
  return { $i18nReady: false };
};

export default { beforeCreate, created, data };
