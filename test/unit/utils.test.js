import { deprecate, warn } from '../../src/utils';

describe('utils', () => {
  describe('log', () => {
    it('call console.warn if console is present', () => {
      const spy = sinon.spy(console, 'warn');

      warn('test warning');
      expect(spy.notCalled).to.equal(false);
      expect(spy.callCount).to.equal(1);
      spy.restore();
    });

    it('does nothing if console is not present', () => {
      const spy = sinon.spy(console, 'warn');
      const _console = window.console;

      window.console = undefined;
      warn('test warning');
      window.console = _console;

      expect(spy.notCalled).to.equal(true);
      spy.restore();
    });
  });

  describe('warn', () => {
    it('print error to console if called', () => {
      const spy = sinon.spy(console, 'warn');

      warn('warned');
      expect(spy.notCalled).to.equal(false);
      expect(spy.getCall(0).calledWith('[vue-i18next warn]: warned')).to.equal(true);
      spy.restore();
    });
  });

  describe('deprecate', () => {
    it('print deprecation message to console if called', () => {
      const spy = sinon.spy(console, 'warn');

      deprecate('use something other');
      expect(spy.notCalled).to.equal(false);
      expect(spy.getCall(0).calledWith('[vue-i18next deprecated]: use something other')).to.equal(
        true,
      );
      spy.restore();
    });
  });
});
