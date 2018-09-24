/* eslint-disable global-require*/
import BackendMock from '../helpers/backendMock';

const backend = new BackendMock();
function nextTick() {
  return new Promise(resolve => Vue.nextTick(resolve));
}

describe('Components namespaces', () => {
  const i18next1 = i18next.createInstance();
  let vueI18Next;
  let vm;
  beforeEach((done) => {
    i18next1.init({
      lng: 'en',
      resources: {
        en: {
          translation: { hello: 'Hello' },
          common: { key1: 'Hello {{name}}' },
        },
        de: {
          translation: { hello: 'Hallo' },
          common: { key1: 'Hallo {{name}}' },
        },
      },
    });
    vueI18Next = new VueI18Next(i18next1);

    const el = document.createElement('div');
    vm = new Vue({
      i18n: vueI18Next,
      components: {
        child1: {
          components: {
            'sub-child1': {
              i18nOptions: { lng: 'de' },
              render(h) {
                return h('div', {}, [h('p', { ref: 'hello' }, [this.$t('hello')])]);
              },
            },
            'sub-child2': {
              i18nOptions: { namespaces: 'common' },
              render(h) {
                return h('div', {}, [
                  h('p', { ref: 'key1' }, [this.$t('key1', { name: 'Waldo' })]),
                ]);
              },
            },
          },
          render(h) {
            return h('div', {}, [
              h('sub-child1', { ref: 'sub-child1' }),
              h('sub-child2', { ref: 'sub-child2' }),
            ]);
          },
        },
        child2: {
          i18nOptions: { namespaces: 'common' },
          components: {
            'sub-child1': {
              i18nOptions: { lng: 'de' },
              render(h) {
                return h('div', {}, [h('p', { ref: 'hello' }, [this.$t('hello')])]);
              },
            },
            'sub-child2': {
              render(h) {
                return h('div', {}, [
                  h('p', { ref: 'key1' }, [this.$t('key1', { name: 'Waldo' })]),
                ]);
              },
            },
          },
          render(h) {
            return h('div', {}, [
              h('p', { ref: 'hello' }, [this.$t('hello')]),
              h('sub-child1', { ref: 'sub-child1' }),
              h('sub-child2', { ref: 'sub-child2' }),
            ]);
          },
        },
      },
      render(h) {
        return h('div', {}, [
          h('p', { ref: 'hello' }, [this.$t('hello')]),
          h('child1', { ref: 'child1' }),
          h('child2', { ref: 'child2' }),
        ]);
      },
    }).$mount(el);

    vm.$nextTick(done);
  });

  it('should render sub components correctly', async () => {
    const hello = vm.$refs.hello;
    const deHello = vm.$refs.child1.$refs['sub-child1'].$refs.hello;
    const commonHello = vm.$refs.child1.$refs['sub-child2'].$refs.key1;

    // const child2Hello = vm.$refs.child2;
    const child2Sub1 = vm.$refs.child2.$refs['sub-child1'].$refs.hello;
    const child2Sub2 = vm.$refs.child2.$refs['sub-child2'].$refs.key1;

    backend.flush();
    await nextTick();

    expect(hello.textContent).to.equal('Hello');
    expect(deHello.textContent).to.equal('Hallo');
    expect(commonHello.textContent).to.equal('Hello Waldo');

    expect(child2Sub1.textContent).to.equal('Hallo');
    expect(child2Sub2.textContent).to.equal('Hello Waldo');
  });
});

describe('Component inline translation', () => {
  describe('only with the i18n tag', () => {
    const i18next1 = i18next.createInstance();
    let vueI18Next;
    let vm;
    beforeEach((done) => {
      i18next1.init({
        lng: 'en',
        resources: {
          en: {},
        },
      });
      vueI18Next = new VueI18Next(i18next1);

      const el = document.createElement('div');
      vm = new Vue({
        i18n: vueI18Next,
        __i18n: [
          JSON.stringify({
            en: { yesNo: { yes: 'Yes', maybe: 'Maybe' } },
          }),
          JSON.stringify({
            en: { yesNo: { no: 'No', maybe: 'Maybe?' } },
          }),
        ],
        render(h) {
          return h('div', {}, [
            h('p', { ref: 'yesNoYes' }, [this.$t('yesNo.yes')]),
            h('p', { ref: 'yesNoMaybe' }, [this.$t('yesNo.maybe')]),
            h('p', { ref: 'yesNoNo' }, [this.$t('yesNo.no')]),
          ]);
        },
      }).$mount(el);

      vm.$nextTick(done);
    });

    it('should use the translation in the tag', async () => {
      expect(vm.$refs.yesNoYes.textContent).to.equal('Yes');
      expect(vm.$refs.yesNoMaybe.textContent).to.equal('Maybe?');
      expect(vm.$refs.yesNoNo.textContent).to.equal('No');
    });

    it('should use the translation in the tag', async () => {
      expect(vm.$refs.yesNoYes.textContent).to.equal('Yes');
      expect(vm.$refs.yesNoMaybe.textContent).to.equal('Maybe?');
      expect(vm.$refs.yesNoNo.textContent).to.equal('No');
    });

    describe('should work with parents', () => {
      beforeEach((done) => {
        i18next1.init({
          lng: 'en',
          resources: {
            en: {},
          },
        });
        vueI18Next = new VueI18Next(i18next1);

        const el = document.createElement('div');
        vm = new Vue({
          i18n: vueI18Next,
          i18nOptions: {},
          name: 'main-comp',
          components: {
            child: {
              name: 'child',
              render(h) {
                return h('div', {}, [h('p', { ref: 'yesNoYes' }, [this.$t('yesNo.yes')])]);
              },
            },
          },
          __i18n: [
            JSON.stringify({
              en: { yesNo: { yes: 'Yes', maybe: 'Maybe' } },
            }),
            JSON.stringify({
              en: { yesNo: { no: 'No', maybe: 'Maybe?' } },
            }),
          ],
          render(h) {
            return h('child', { ref: 'subChild' });
          },
        }).$mount(el);

        vm.$nextTick(done);
      });

      it('should merge namespaces even if parent has none', async () => {
        expect(vm.$refs.subChild.$refs.yesNoYes.textContent).to.equal('Yes');
      });
    });
  });

  describe('full options', () => {
    const i18next1 = i18next.createInstance();
    let vueI18Next;
    let vm;
    beforeEach((done) => {
      i18next1.init({
        lng: 'en',
        resources: {
          en: {
            translation: { hello: 'Hello' },
          },
          de: {
            translation: { hello: 'Hallo' },
          },
        },
      });
      vueI18Next = new VueI18Next(i18next1);

      const el = document.createElement('div');
      vm = new Vue({
        i18n: vueI18Next,
        i18nOptions: {
          messages: {
            en: {
              hello: 'Hello!',
              welcome: 'Welcome!',
              yesNo: {
                no: 'No!',
              },
            },
          },
        },
        __i18n: [
          JSON.stringify({
            en: { yesNo: { yes: 'Yes', maybe: 'Maybe' } },
          }),
          JSON.stringify({
            en: { yesNo: { no: 'No', maybe: 'Maybe?' } },
          }),
        ],
        render(h) {
          return h('div', {}, [
            h('p', { ref: 'welcome' }, [this.$t('welcome')]),
            h('p', { ref: 'hello' }, [this.$t('hello')]),
            h('p', { ref: 'yesNoYes' }, [this.$t('yesNo.yes')]),
            h('p', { ref: 'yesNoMaybe' }, [this.$t('yesNo.maybe')]),
            h('p', { ref: 'yesNoNo' }, [this.$t('yesNo.no')]),
          ]);
        },
      }).$mount(el);

      vm.$nextTick(done);
    });

    it('should use the inline translation if no other is found', async () => {
      const root = vm.$refs.welcome;
      expect(root.textContent).to.equal('Welcome!');
    });

    it('should use the inline translation only if none other is found', async () => {
      const root = vm.$refs.hello;
      expect(root.textContent).to.equal('Hello');
    });

    it('should use the __i18n options', async () => {
      expect(vm.$refs.yesNoYes.textContent).to.equal('Yes');
      expect(vm.$refs.yesNoMaybe.textContent).to.equal('Maybe?');
      expect(vm.$refs.yesNoNo.textContent).to.equal('No!');
    });
  });
});

describe('Components with backend', () => {
  describe('namespace on top component', () => {
    const i18next1 = i18next.createInstance();
    let vueI18Next;
    let vm;
    beforeEach((done) => {
      i18next1.use(backend).init({
        lng: 'en',
      });
      vueI18Next = new VueI18Next(i18next1);

      const el = document.createElement('div');
      vm = new Vue({
        i18n: vueI18Next,
        i18nOptions: { namespaces: 'common' },

        render(h) {
          return h('div', {}, [h('p', { ref: 'hello' }, [this.$t('key1')])]);
        },
      }).$mount(el);

      vm.$nextTick(done);
    });

    it('should render sub components correctly', async () => {
      const root = vm.$refs.hello;
      expect(root.textContent).to.equal('key1');
      backend.flush();
      await nextTick();

      expect(root.textContent).to.equal('dev__common__test');
    });

    it('should wait for translation to be ready', async () => {
      const root = vm.$refs.hello;
      expect(root.textContent).to.equal('key1');
      backend.flush();
      await nextTick();

      expect(root.textContent).to.equal('dev__common__test');
    });
  });

  describe('Nested namespaces', () => {
    const i18next1 = i18next.createInstance();
    let vueI18Next;
    let vm;
    beforeEach((done) => {
      i18next1.use(backend).init({
        lng: 'en',
        fallbackLng: ['de', 'en'],
      });
      vueI18Next = new VueI18Next(i18next1);

      const el = document.createElement('div');
      vm = new Vue({
        i18n: vueI18Next,
        components: {
          child1: {
            components: {
              'sub-child1': {
                i18nOptions: { lng: 'de' },
                render(h) {
                  return h('div', {}, [h('p', { ref: 'key11' }, [this.$t('key1')])]);
                },
              },
              'sub-child2': {
                i18nOptions: { namespaces: 'common' },
                render(h) {
                  return h('div', {}, [h('p', { ref: 'key12' }, [this.$t('key1')])]);
                },
              },
            },
            render(h) {
              return h('div', {}, [
                h('sub-child1', { ref: 'sub-child1' }),
                h('sub-child2', { ref: 'sub-child2' }),
                h('sub-child2', { ref: 'sub-child3' }),
              ]);
            },
          },
        },
        render(h) {
          return h('div', {}, [h('child1', { ref: 'child1' })]);
        },
      }).$mount(el);

      vm.$nextTick(done);
    });

    it('should render sub components correctly', async () => {
      const key11 = vm.$refs.child1.$refs['sub-child1'].$refs.key11;
      const key12 = vm.$refs.child1.$refs['sub-child2'].$refs.key12;

      backend.flush();
      await nextTick();

      expect(key11.textContent).to.equal('de__translation__test');
      expect(key12.textContent).to.equal('de__common__test');
    });
  });
});
