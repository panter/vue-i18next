function nextTick() {
  return new Promise(resolve => Vue.nextTick(resolve));
}

describe('$t', () => {
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

  describe('$t computed', () => {
    describe('should translate', () => {
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
    });
  });
});
