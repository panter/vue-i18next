import sinon from 'sinon';

function nextTick() {
  return new Promise(resolve => Vue.nextTick(resolve));
}

describe('directive', () => {
  describe('should translate', () => {
    let vueI18Next;
    beforeEach(() => {
      vueI18Next = new VueI18Next(i18next);
      i18next.init({
        lng: 'en',
        resources: {
          en: {
            translation: {
              hello: 'Hello',
              helloPerson: 'Hello {{name}}',
            },
          },
          de: {
            translation: {
              hello: 'Hallo',
              helloPerson: 'Hallo {{name}}',
            },
          },
        },
      });
    });

    it('if value is only a key', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          // <p ref="text" v-t="'hello'"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: 'hello',
                expression: "'hello'",
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<p>Hello</p>');
    });

    // TODO: spy on t, this is test is not working atm
    it('should cache value', async () => {
      const el = document.createElement('div');
      // const spy = sinon.spy(t);
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
          // <p ref="text" v-t="'hello'"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: 'hello',
                expression: "'hello'",
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      vm.$forceUpdate();
      await nextTick();
      // expect(spy.notCalled).to.equal(false);
      // expect(spy.callCount).to.equal(1);
      // spy.restore();
    });

    // TODO: spy on t, this is test is not working atm
    it('should not cache value if value changes', async () => {
      const el = document.createElement('div');
      // const spy = sinon.spy(t);
      const vm = new Vue({
        i18n: vueI18Next,
        data: { name: 'Hans' },
        render(h) {
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: {
                  path: 'helloPerson',
                  args: { name: this.name, lng: 'de' },
                },
                expression: "{ path: 'helloPerson', args: { name: this.name, lng: 'de' } }",
              },
            ],
          });
        },
      }).$mount(el);

      vm.name = 'Peter';
      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<p>Hallo Peter</p>');
    });

    it('should check the language', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        data: {
          tkey: 'helloPerson',
        },
        render(h) {
          // <p ref="text" v-t="{ path: msgPath, args: { name: 'Hans', lng: 'de' } }"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: {
                  path: this.tkey,
                  args: { name: 'Hans', lng: 'de' },
                },
                expression: "{ path: tkey, language: 'de', args: { name: 'Hans' } }",
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<p>Hallo Hans</p>');
    });

    it('should use i18n.t if no language is specified', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        data: {
          tkey: 'helloPerson',
        },
        render(h) {
          // <p ref="text" v-t="{ path: msgPath, args: { name: 'Hans' } }"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: {
                  path: this.tkey,
                  args: { name: 'Hans' },
                },
                expression: "{ path: tkey, args: { name: 'Hans' } }",
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<p>Hello Hans</p>');
    });

    it('reactivity', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        data: {
          tkey: 'helloPerson',
        },
        render(h) {
          // <p ref="text" v-t="{ path: msgPath, args: { name: 'hans' } }"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: {
                  path: this.tkey,
                  args: { name: 'Hans' },
                },
                expression: "{ path: tkey, args: { name: 'Hans' } }",
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<p>Hello Hans</p>');
      vm.$i18n.i18next.changeLanguage('de');
      vm.$forceUpdate();
      await nextTick();
      expect(vm.$el.outerHTML).to.equal('<p>Hallo Hans</p>');
    });

    it('value warning', async () => {
      const el = document.createElement('div');
      const spy = sinon.spy(console, 'warn');
      new Vue({
        i18n: vueI18Next,
        render(h) {
          // <p ref="text" v-t="false"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: false,
                expression: 'false',
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(spy.notCalled).to.equal(false);
      expect(spy.callCount).to.equal(1);
      spy.restore();
    });

    it('path warning', async () => {
      const el = document.createElement('div');
      const spy = sinon.spy(console, 'warn');
      new Vue({
        i18n: vueI18Next,
        render(h) {
          // <p ref="text" v-t="{ language: 'de', args: { name: 'Hans' } }"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: { language: 'de', args: { name: 'Hans' } },
                expression: "{ language: 'de', args: { name: 'Hans' } }",
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(spy.notCalled).to.equal(false);
      expect(spy.callCount).to.equal(1);
      spy.restore();
    });

    it('vuei18Next instance warning', async () => {
      const el = document.createElement('div');
      const spy = sinon.spy(console, 'warn');
      new Vue({
        render(h) {
          // <p ref="text" v-t="{ language: 'de', args: { name: 'Hans' } }"></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 't',
                rawName: 'v-t',
                value: { language: 'de', args: { name: 'Hans' } },
                expression: "{ language: 'de', args: { name: 'Hans' } }",
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(spy.notCalled).to.equal(false);
      expect(spy.callCount).to.equal(1);
      spy.restore();
    });
  });
});
