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
          en: {
            translation: {
              hello: '{{0}} Hello',
              hello1: 'Hello {{0}} {{1}}',
              hello2: 'Hello {{1}} {{0}}.',
            },
          },
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
      expect(vm.$el.outerHTML).to.equal('<span>You Hello</span>');
    });

    it('should interpolate components', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('i18next', { ref: 'text', props: { tag: 'div', path: 'hello1' } }, [
            h('p', { domProps: { textContent: this.$t('hello', { 0: 'First' }) } }),
            h('span', ['test']),
          ]);
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<div>Hello <p>First Hello</p> <span>test</span></div>');
    });

    it('should interpolate components by index', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('i18next', { ref: 'text', props: { tag: 'div', path: 'hello2' } }, [
            h('p', { domProps: { textContent: this.$t('hello', { 0: 'First' }) } }),
            h('span', ['test']),
          ]);
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<div>Hello <span>test</span> <p>First Hello</p>.</div>');
    });
  });
});
