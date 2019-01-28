import deepmerge from 'deepmerge';

const getByKey = (i18nextOptions, keyPrefix) => (key) => {
  if (keyPrefix && !key.includes(i18nextOptions.nsSeparator)) {
    return `${keyPrefix}.${key}`;
  }
  return key;
};

const getComponentNamespace = (vmOptions, i18nOptions) => {
  const namespace = i18nOptions.componentNamespace || vmOptions.name || vmOptions._componentTag;
  return {
    componentNamespace: namespace || `${Math.random()}`,
    canLoadComponentNamespace: !!namespace,
  };
};

const getInlineTranslations = (options) => {
  let translations = {};
  if (options.__i18n) {
    translations = options.__i18n.reduce((a, r) => deepmerge(a, JSON.parse(r)), {});
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
    const namespacesToLoad = [];
    const { componentNamespace, canLoadComponentNamespace } = getComponentNamespace(
      options,
      this._i18n.options,
    );

    if (canLoadComponentNamespace && this._i18n.options.loadComponentNamespace) {
      namespacesToLoad.push(componentNamespace);
    }

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
      let { namespaces } = options.i18nOptions;

      namespaces = namespaces || this._i18n.i18next.options.defaultNS;
      if (typeof namespaces === 'string') namespaces = [namespaces];

      this._i18nOptions = {
        lng,
        namespaces: namespaces.concat([componentNamespace]),
      };

      namespacesToLoad.push(...namespaces);
    } else if (options.parent && options.parent._i18nOptions) {
      // Use parent i18nOptions if there are any

      this._i18nOptions = {
        ...options.parent._i18nOptions,
        namespaces: [componentNamespace, ...options.parent._i18nOptions.namespaces],
      };
    } else if (Object.keys(inlineTranslations).length > 0) {
      // if no options are provided but there are inline translations construct the namespace
      // with the componentNamespace
      this._i18nOptions = { namespaces: [componentNamespace] };
    }

    // TODO: use computed prop to signalize that the namespaces are loaded
    if (namespacesToLoad.length > 0) {
      this._i18n.i18next.loadNamespaces(namespacesToLoad);
    }
  }

  const getKey = getByKey(
    this._i18n ? this._i18n.i18next.options : {},
    options.i18nOptions && options.i18nOptions.keyPrefix,
  );

  // use getFixedT from i18next if options provide namespaces
  if (this._i18nOptions && this._i18nOptions.namespaces) {
    const { lng, namespaces } = this._i18nOptions;

    const fixedT = this._i18n.i18next.getFixedT(lng, namespaces);
    this._t = (key, i18nextOptions) => fixedT(getKey(key), i18nextOptions, this._i18n.i18nLoadedAt);
  } else {
    this._t = (key, i18nextOptions) =>
      this._i18n.t(getKey(key), i18nextOptions, this._i18n.i18nLoadedAt);
  }
}

export default { beforeCreate };
