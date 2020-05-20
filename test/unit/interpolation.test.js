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
              hello3: 'Hello {{first}} {{second}}.',
              counter: '{{0}} singular',
              counter_plural: '{{0}} plural',
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

    it('should interpolate components by place', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('i18next', { ref: 'text', props: { tag: 'div', path: 'counter', options: { count: 2 } } }, [
            h('p', { domProps: { textContent: 'Counter' } }),
          ]);
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<div><p>Counter</p> plural</div>');
    });

    it('should interpolate components supporting plurals', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('i18next', { ref: 'text', props: { tag: 'div', path: 'hello3' } }, [
            h('p', { domProps: { textContent: 'First Hello' }, attrs: { place: 'first' } }),
            h('span', { domProps: { textContent: 'test' }, attrs: { place: 'second' } }),
          ]);
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<div>Hello <p place="first">First Hello</p> <span place="second">test</span>.</div>');
    });

    it('should interpolate components supporting text nodes', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          return h('i18next', { ref: 'text', props: { tag: 'div', path: 'hello3' } }, [
            h('p', { domProps: { textContent: 'First Hello' }, attrs: { place: 'first' } }),
            'hello',
            h('span', { domProps: { textContent: 'test' }, attrs: { place: 'second' } }),
          ]);
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<div>Hello <p place="first">First Hello</p> <span place="second">test</span>.</div>');
    });

    it('should just return the children if i18next is not installed', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        render(h) {
          return h('i18next', { props: { tag: 'div', path: 'hello2' } }, [
            h('span', ['test']),
          ]);
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<div><span>test</span></div>');
    });
  });
});
