function nextTick() {
  return new Promise(resolve => Vue.nextTick(resolve));
}

describe('$t loaded languages', () => {
  describe('should translate', () => {
    let vueI18Next;
    beforeEach(() => {
      vueI18Next = new VueI18Next(i18next);
      i18next.init({
        lng: 'en',
        resources: {
          en: { translation: { hello: 'Hello' } },
          de: { translation: { hello: 'Hallo' } },
        },
      });
    });

    it('should translate an english', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('p', { ref: 'text' }, [this.$t('hello')]);
        },
      }).$mount(el);

      await nextTick();
      const { text } = vm.$refs;
      expect(text.textContent).to.equal('Hello');
    });

    it('should show german when changing current language to de', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('p', { ref: 'text' }, [this.$t('hello')]);
        },
      }).$mount(el);

      i18next.changeLanguage('de');
      await nextTick();
      const { text } = vm.$refs;
      expect(text.textContent).to.equal('Hallo');
    });
  });

  describe('$t load languages', () => {
    let vueI18Next;
    beforeEach(() => {
      vueI18Next = new VueI18Next(i18next);
      i18next.init({
        lng: 'en',
        resources: {
          en: { translation: { hello: 'Hello' } },
        },
      });
    });

    it('should translate to german after loaded', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('p', { ref: 'text' }, [this.$t('hello')]);
        },
      }).$mount(el);

      const { text } = vm.$refs;
      await nextTick();
      expect(text.textContent).to.equal('Hello');
      i18next.changeLanguage('de');
      i18next.addResourceBundle('de', 'translation', { hello: 'Hallo' });
      await nextTick();
      expect(text.textContent).to.equal('Hallo');
    });
  });


  describe('do not bind any listeners', () => {
    let vueI18Next;
    beforeEach(() => {
      vueI18Next = new VueI18Next(i18next, { bindI18n: '', bindStore: '' });
      i18next.init({
        lng: 'en',
        resources: {
          en: { translation: { hello: 'Hello' } },
        },
      });
    });

    it('should translate to german after loaded', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('p', { ref: 'text' }, [this.$t('hello')]);
        },
      }).$mount(el);

      const { text } = vm.$refs;
      await nextTick();
      expect(text.textContent).to.equal('Hello');
      i18next.changeLanguage('de');
      i18next.addResourceBundle('de', 'translation', { hello: 'Hallo' });
      await nextTick();
      expect(text.textContent).to.equal('Hello');
    });
  });

  describe('prefix key', () => {
    let vueI18Next;
    beforeEach(() => {
      vueI18Next = new VueI18Next(i18next);
      i18next.init({
        lng: 'en',
        resources: {
          en: {
            translation: { messages: { hello: 'Hello' }, },
            common: { goodbye: 'Goodbye' }
          },
        },
      });
    });

    it('should use the keyPrefix property', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        i18nOptions: { keyPrefix: 'messages' },
        render(h) {
          return h('p', { ref: 'text' }, [this.$t('hello')]);
        },
      }).$mount(el);

      const { text } = vm.$refs;
      await nextTick();
      expect(text.textContent).to.equal('Hello');
    });

    it('should ignore keyPrefix property if namespace prefix used', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        i18nOptions: { keyPrefix: 'messages' },
        render(h) {
          return h('p', { ref: 'text' }, [this.$t('common:goodbye')]);
        },
      }).$mount(el);

      const { text } = vm.$refs;
      await nextTick();
      expect(text.textContent).to.equal('Goodbye');
    });
  });
});

describe('loads namespaces', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not load component namespaces', async () => {
    const loadNamespaces = sandbox.stub(i18next, 'loadNamespaces');

    const vueI18Next = new VueI18Next(i18next);
    i18next.init({
      lng: 'en',
    });
    const el = document.createElement('div');
    new Vue({
      i18n: vueI18Next,
      i18nOptions: { namespace: 'namespace1' },
      components: {
        child1: {
          render(h) {
            return h('div', {}, [h('p', { ref: 'text' }, [this.$t('goodbye')])]);
          },
        },
      },
      render(h) {
        return h('child1', { ref: 'child1' });
      },
    }).$mount(el);

    await nextTick();
    expect(loadNamespaces).to.have.been.calledOnce;
  });

  it('should load component namespaces if loadComponentNamespace = true', async () => {
    const loadNamespaces = sandbox.stub(i18next, 'loadNamespaces');

    const vueI18Next = new VueI18Next(i18next, { loadComponentNamespace: true });
    i18next.init({
      lng: 'en',
    });
    const el = document.createElement('div');
    new Vue({
      i18n: vueI18Next,
      components: {
        child1: {
          render(h) {
            return h('div', { ref: ' div' }, [h('p', { ref: 'text' }, [this.$t('goodbye')])]);
          },
        },
      },
      render(h) {
        return h('child1', { ref: 'child1' });
      },
    }).$mount(el);

    await nextTick();
    expect(loadNamespaces).to.have.been.calledOnce;
  });

  it('should use the getComponentNamespace to load the namespace', async () => {
    const loadNamespaces = sandbox.stub(i18next, 'loadNamespaces');

    const vueI18Next = new VueI18Next(i18next, {
      loadComponentNamespace: true,
      getComponentNamespace: () => ({ namespace: 'comp-ns', loadNamespace: true }),
    });
    i18next.init({
      lng: 'en',
    });
    const el = document.createElement('div');
    new Vue({
      i18n: vueI18Next,
      components: {
        child1: {
          render(h) {
            return h('div', { ref: ' div' }, [h('p', { ref: 'text' }, [this.$t('goodbye')])]);
          },
        },
      },
      render(h) {
        return h('child1', { ref: 'child1' });
      },
    }).$mount(el);

    await nextTick();
    expect(loadNamespaces).to.have.been.calledWith(['comp-ns']);
  });

  it('should not load namespace if global loadComponentNamespace is false', async () => {
    const loadNamespaces = sandbox.stub(i18next, 'loadNamespaces');

    const vueI18Next = new VueI18Next(i18next, {
      getComponentNamespace: () => ({ namespace: 'comp-ns', loadNamespace: true }),
    });
    i18next.init({
      lng: 'en',
    });
    const el = document.createElement('div');
    new Vue({
      i18n: vueI18Next,
      components: {
        child1: {
          render(h) {
            return h('div', { ref: ' div' }, [h('p', { ref: 'text' }, [this.$t('goodbye')])]);
          },
        },
      },
      render(h) {
        return h('child1', { ref: 'child1' });
      },
    }).$mount(el);

    await nextTick();
    expect(loadNamespaces).to.have.been.not.called;
  });
});
