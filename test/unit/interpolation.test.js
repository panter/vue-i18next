function nextTick() {
  return new Promise(resolve => Vue.nextTick(resolve));
}

describe('interpolation', () => {
  describe('should translate', () => {
    let vueI18Next;
    beforeEach(() => {
      vueI18Next = new VueI18Next(i18next);
      i18next.init({
        lng: 'en',
        resources: {
          en: { translation: { hello: '{{0}} Hello' } },
        },
      });
    });

    it('should translate an english', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('i18next', { ref: 'text', props: { path: 'hello' } }, ['You']);
        },
      }).$mount(el);

      await nextTick();
      const { text } = vm.$refs;
      expect(text.textContent).to.equal('You Hello');
    });
  });
});
