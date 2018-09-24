import BackendMock from '../helpers/backendMock';
import { bind, update } from '../../src/wait';
import sinon from 'sinon';

const backend = new BackendMock();

class I18nextMock {

  constructor() {
    this.events = { on: [], off: [] };
    this.isInitialized = undefined;
  }

  off(event, options) {
    this.events.off.push({ event, options });
  }

  on(event, options) {
    this.events.on.push({ event, options });
  }

  mockFireEvent(e) {
    this.events.on
      .filter(({ event }) => e === event)
      .map(({ options }) => options());
  }
}

function nextTick() {
  return new Promise(resolve => Vue.nextTick(resolve));
}

function sleep(time = 50) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

describe('wait directive', () => {
  describe('with already loaded resources', () => {
    const i18next1 = i18next.createInstance();
    let vueI18Next;
    beforeEach(() => {
      i18next1.init({
        lng: 'en',
        fallbackLng: 'en',
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
    });

    it('should not wait if translations are already ready', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
        // <p ref="text" v-waitForT></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 'waitForT',
                rawName: 'v-waitForT',
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.hidden).to.equal(false);
    });

    it('vuei18Next instance warning', async () => {
      const el = document.createElement('div');
      const spy = sinon.spy(console, 'warn');
      new Vue({
        render(h) {
          // <p ref="text" v-waitForT></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 'waitForT',
                rawName: 'v-waitForT',
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

    it('resets i18n listener workaround', async () => {
      const i18next = new I18nextMock();
      const vm = {
        context: {
          $forceUpdate: () => undefined,
          $i18n: {
            i18next,
          },
        },
      };

      const spy = sinon.spy(vm.context, '$forceUpdate');

      bind({}, null, vm);

      expect(i18next.events.on.length).to.equal(1);
      expect(i18next.events.off.length).to.equal(0);

      i18next.mockFireEvent('initialized');
      expect(spy.called).to.equal(true);

      await sleep(1500);

      expect(i18next.events.off.length).to.equal(1);
    });

    it('resets i18n listener workaround and does it only if context is still valid', async () => {
      const i18next = new I18nextMock();
      const vm = {
        context: {
          $forceUpdate: () => undefined,
          $i18n: {
            i18next,
          },
        },
      };

      const spy = sinon.spy(vm.context, '$forceUpdate');

      bind({}, null, vm);

      expect(i18next.events.on.length).to.equal(1);
      expect(i18next.events.off.length).to.equal(0);

      i18next.mockFireEvent('initialized');
      expect(spy.called).to.equal(true);
      vm.context = undefined;

      await sleep(1500);

      expect(i18next.events.off.length).to.equal(0);
    });

    it('do not show on update if it is not initialized', async () => {
      const el = { hidden: true };
      update(el, null, { context: { $i18n: { i18next: { isInitialized: false } } } });
      expect(el.hidden).to.equal(true);
    });

    it('do not show on update if it is not initialized', async () => {
      const el = { hidden: true };
      update(el, null, { context: { $i18n: { i18next: { isInitialized: true } } } });
      expect(el.hidden).to.equal(false);
    });
  });

  describe('withBackend', () => {
    const i18next1 = i18next.createInstance();
    let vueI18Next;
    beforeEach(async () => {
      i18next1.use(backend).init({
        lng: 'en',
      });
      vueI18Next = new VueI18Next(i18next1);

      await sleep(50);
    });

    it('should wait for translation to be ready', async () => {
      const el = document.createElement('div');
      const vm = new Vue({
        i18n: vueI18Next,
        render(h) {
        // <p ref="text" v-waitForT></p>
          return h('p', {
            ref: 'text',
            directives: [
              {
                name: 'waitForT',
                rawName: 'v-waitForT',
              },
            ],
          });
        },
      }).$mount(el);

      await nextTick();
      expect(vm.$el.hidden).to.equal(true);
      backend.flush();
      await nextTick();
      expect(vm.$el.hidden).to.equal(false);
    });
  });
});
