class Backend {
  constructor(services, options = {}) {
    this.init(services, options);
    this.type = 'backend';
    this.queue = [];
  }

  init(services, options) {
    this.services = services;
    this.options = options;
  }

  read(language, namespace, callback) {
    this.queue.push({ language, namespace, callback });
  }
  flush() {
    this.queue.forEach(({ language, namespace, callback }) => {
      callback(null, {
        key1: `${language}__${namespace}__test`,
        interpolateKey: `${language}__${namespace}__add {{insert}} {{up, uppercase}}`,
      });
    });
  }
}

Backend.type = 'backend';

export default Backend;
