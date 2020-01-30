describe('basic', () => {
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

  describe('i18n#t', () => {
    describe('should translate', () => {
      it('should translate an english', () => {
        expect(vueI18Next.t('hello')).to.equal('Hello');
      });

      it('should translate an german', () => {
        expect(vueI18Next.t('hello')).to.equal('Hello');
      });
    });
  });

  describe('i18n#resetVm', () => {
    it('should init i18nLoadedAt', () => {
      expect(typeof vueI18Next.i18nLoadedAt).to.equal(typeof new Date());
    });
    it('should reset old vm', () => {
      const oldVm = vueI18Next._vm;
      vueI18Next.resetVM({ i18nLoadedAt: new Date() });
      expect(oldVm).to.not.equal(vueI18Next._vm);
    });
  });

  describe('does not install itself multiple times', () => {
    it('aborts if already intalled', () => {
      expect(VueI18Next.install.installed).to.be.true;
      let duckMixin = false;
      Vue.mixin = () => { duckMixin = true; };
      VueI18Next.install(Vue);
      expect(duckMixin).to.be.false;
    });
  });
  describe('if $i18n is already defined', () => {
    it('should still install just fine', () => {
      // If there are two instances of VueI18Next such as using a library that is using VueI18Next
      // while the base project also uses VueI18Next then when the plugin tries to install VueI18Next
      // it's VueI18Next.install.installed will be false as it should be and when it gets to
      // where it should define $i18n on Vue's prototype can't because it's already defined and that is fine
      VueI18Next.install.installed = false;
      VueI18Next.install(Vue);
      expect(VueI18Next.install.installed).to.be.true;
    });
  });
});
