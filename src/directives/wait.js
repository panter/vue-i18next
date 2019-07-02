/* eslint-disable no-param-reassign, no-unused-vars */

import { warn } from '../utils';

function assert(vnode) {
  const vm = vnode.context;

  if (!vm.$i18n) {
    warn('No VueI18Next instance found in the Vue instance');
    return false;
  }

  return true;
}

function waitForIt(el, vnode) {
  if (vnode.context.$i18n.i18next.isInitialized) {
    el.hidden = false;
  } else {
    el.hidden = true;
    const initialized = () => {
      vnode.context.$forceUpdate();
      // due to emitter removing issue in i18next we need to delay remove
      setTimeout(() => {
        if (vnode.context && vnode.context.$i18n) {
          vnode.context.$i18n.i18next.off('initialized', initialized);
        }
      }, 1000);
    };
    vnode.context.$i18n.i18next.on('initialized', initialized);
  }
}

export function bind(el, binding, vnode) {
  if (!assert(vnode)) {
    return;
  }

  waitForIt(el, vnode);
}

export function update(el, binding, vnode, oldVNode) {
  if (vnode.context.$i18n.i18next.isInitialized) {
    el.hidden = false;
  }
}

export default {
  bind,
  update
};
