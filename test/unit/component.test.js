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
                return h('div', { }, [
                  h('p', { ref: 'hello' }, [this.$t('hello')]),
                ]);
              },
            },
            'sub-child2': {
              i18nOptions: { namespaces: 'common' },
              render(h) {
                return h('div', { }, [
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
      },
      render(h) {
        return h('div', {}, [
          h('p', { ref: 'hello' }, [this.$t('hello')]),
          h('child1', { ref: 'child1' }),
        ]);
      },
    }).$mount(el);


    vm.$nextTick(done);
  });

  it('should render sub components correctly', async () => {
    const hello = vm.$refs.hello;
    const deHello = vm.$refs.child1.$refs['sub-child1'].$refs.hello;
    const commonHello = vm.$refs.child1.$refs['sub-child2'].$refs.key1;

    backend.flush();
    await nextTick();

    expect(hello.textContent).to.equal('Hello');
    expect(deHello.textContent).to.equal('Hallo');
    expect(commonHello.textContent).to.equal('Hello Waldo');
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
          return h('div', {}, [
            h('p', { ref: 'hello' }, [this.$t('key1')]),
          ]);
        },
      }).$mount(el);


      vm.$nextTick(done);
    });

    it('should render sub components correctly', async () => {
      const root = vm.$refs.hello;
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
                  return h('div', { }, [
                    h('p', { ref: 'key11' }, [this.$t('key1')]),
                  ]);
                },
              },
              'sub-child2': {
                i18nOptions: { namespaces: 'common' },
                render(h) {
                  return h('div', { }, [
                    h('p', { ref: 'key12' }, [this.$t('key1')]),
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
        },
        render(h) {
          return h('div', {}, [
            h('child1', { ref: 'child1' }),
          ]);
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
