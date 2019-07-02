/* eslint-disable no-param-reassign, no-unused-vars */

import { warn, deprecate } from '../utils';

function equalLanguage(el, vnode) {
  const vm = vnode.context;
  return el._i18nLanguage === vm.$i18n.i18next.language;
}

function equalValue(value, oldValue) {
  if (value === oldValue) {
    return true;
  }
  if (value && oldValue) {
    return value.path === oldValue.path && value.args === oldValue.args;
  }
}

function assert(vnode) {
  const vm = vnode.context;

  if (!vm.$i18n) {
    warn('No VueI18Next instance found in the Vue instance');
    return false;
  }

  return true;
}

function parseValue(value) {
  let path;
  let args;

  if (typeof value === 'string') {
    path = value;
  } else if (toString.call(value) === '[object Object]') {
    ({ path, args } = value);
  }

  return { path, args };
}

function t(el, binding, vnode) {
  const { value } = binding;

  const { path, args } = parseValue(value);
  if (!path && !args) {
    warn('v-t: invalid value');
    return;
  }

  if (!path) {
    warn('v-t: "path" is required');
    return;
  }

  const vm = vnode.context;
  el.textContent = vm.$i18n.i18next.t(path, { ...args });

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

export default {
  bind,
  update
};
