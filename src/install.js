/* eslint-disable import/no-mutable-exports */
import component from './component';
import directive from './directives/t';
import waitDirective from './directives/wait';
import mixins from './mixins';

export let Vue;

export function install(_Vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  // store original / main Vue instance for later usage
  Vue = _Vue;

  // extend with mixins
  Vue.mixin(mixins);

  // define $i18n getter
  if (!Object.prototype.hasOwnProperty.call(Vue.prototype, '$i18n')) {
    Object.defineProperty(Vue.prototype, '$i18n', {
      get() {
        return this._i18n;
      }
    });
  }

  // define $t
  Vue.prototype.$t = function t(key, options) {
    return this._t(key, options);
  };

  // register component
  Vue.component(component.name, component);

  // register directives
  Vue.directive('t', directive);
  Vue.directive('waitForT', waitDirective);
}
