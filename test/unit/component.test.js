describe('Components', () => {
  let vueI18Next;
  let vm;
  beforeEach((done) => {
    vueI18Next = new VueI18Next(i18next);
    i18next.init({
      lng: 'en',
      resources: {
        en: {
          translation: {
            hello: 'Hello',
            hello1: 'Hello1',
          },
        },
      },
    });

    const el = document.createElement('div');
    vm = new Vue({
      i18n: vueI18Next,
      components: {
        child1: {
          components: {
            'sub-child1': {
              render(h) {
                return h('div', {}, [
                  h('p', { ref: 'hello1' }, [this.$t('hello1')]),
                ]);
              },
            },
          },
          render(h) {
            return h('div', {}, [
              h('p', { ref: 'hello' }, [this.$t('hello')]),
              h('sub-child1', { ref: 'sub-child1' }),
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

  it('should render sub components correctly', () => {
    const root = vm.$refs.hello;
    const hello = vm.$refs.child1.$refs.hello;
    const hello1 = vm.$refs.child1.$refs['sub-child1'].$refs.hello1;

    expect(root.textContent).to.equal('Hello');
    expect(hello.textContent).to.equal('Hello');
    expect(hello1.textContent).to.equal('Hello1');
  });
});
