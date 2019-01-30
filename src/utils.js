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

export function isFunction(x) {
  return typeof x === 'function';
}

export function range(count) {
  const arr = new Array(count);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    arr[i] = '';
  }

  return arr;
}

export function generateId(count = 18) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return range(count).reduce(
    id => id + alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
    '',
  );
}
