const helpersContext = require.context('../helpers', true);
helpersContext.keys().forEach(helpersContext);

const testsContext = require.context('./', true, /\.test/);
testsContext.keys().forEach(testsContext);

const srcContext = require.context('../../src', true, /\.js/);
srcContext.keys().forEach(srcContext);
