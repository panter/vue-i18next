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
});
