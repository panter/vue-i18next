/* eslint-disable import/prefer-default-export */

export function log(message) {
  if (typeof console !== 'undefined') {
    console.warn(message); // eslint-disable-line no-console
  }
}

export function warn(message) {
  log(`[vue-i18next warn]: ${message}`);
}

export function deprecate(message) {
  log(`[vue-i18next deprecated]: ${message}`);
}
