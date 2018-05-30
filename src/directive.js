/* eslint-disable no-param-reassign, no-console, no-unused-vars */

function equalLanguage(el, vnode) {
  const vm = vnode.context;
  return el._i18nLanguage === vm.$i18n.i18next.language;
}

function equalValue(value, oldValue) {
  if (value === oldValue) {
    return true;
  } else if (value && oldValue) {
    return (
      value.path === oldValue.path &&
      value.language === oldValue.language &&
      value.args === oldValue.args
    );
  }
}

function assert(vnode) {
  const vm = vnode.context;

  if (!vm.$i18n) {
    console.log('No VueI18Next instance found in the Vue instance');
    return false;
  }

  return true;
}

function parseValue(value) {
  let path;
  let language;
  let args;

  if (typeof value === 'string') {
    path = value;
  } else if (toString.call(value) === '[object Object]') {
    path = value.path;
    language = value.language;
    args = value.args;
  }

  return { path, language, args };
}

function t(el, binding, vnode) {
  const value = binding.value;

  const { path, language, args } = parseValue(value);
  if (!path && !language && !args) {
    console.log('v-t: invalid value');
    return;
  }

  if (!path) {
    console.log('v-t: `path` is required');
    return;
  }

  const vm = vnode.context;
  el.textContent = language
    ? vm.$i18n.i18next.getFixedT(language)(path, args)
    : vm.$i18n.i18next.t(path, args);

  el._i18nLanguage = vm.$i18n.i18next.language;
}

export function bind(el, binding, vnode) {
  if (!assert(vnode)) {
    return;
  }

  t(el, binding, vnode);
}

export function update(el, binding, vnode, oldVNode) {
  if (equalLanguage(el, vnode) && equalValue(binding.value, binding.oldValue)) {
    return;
  }

  t(el, binding, vnode);
}
