# vue-i18next

[![Build Status](https://travis-ci.org/panter/vue-i18next.svg?branch=master)](https://travis-ci.org/panter/vue-i18next)
[![Coverage Status](https://coveralls.io/repos/github/panter/vue-i18next/badge.svg?branch=master)](https://coveralls.io/github/panter/vue-i18next?branch=master) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Internationalization for vue using the i18next i18n ecosystem. <https://panter.github.io/vue-i18next/>

# Introduction

18next goes beyond just providing the standard i18n features such as (plurals, context, interpolation, format). It provides you with a complete solution to localize your product from web to mobile and desktop.

**vue-i18next** is the vue support for i18next and provides:

* Component based localization
* Component interpolation
* Lazy load namespaces
* Namespaced translation for components

### Requirements

* vue >= **2.0.0**
* i18next >= **6.0.1**


## Documentation

See [here](http://panter.github.io/vue-i18next/)


## Init

```javascript
import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';

Vue.use(VueI18Next);

i18next.init({
  lng: 'de',
  resources: {
    ...
  }
});

const i18n = new VueI18Next(i18next);
new Vue({
  ...
  i18n: i18n,
});
```

## Changelog

Detailed changes for each release are documented in the [releases](https://github.com/panter/vue-i18next/releases).


## Issues

Please make sure to read the [Issue Reporting Checklist](https://github.com/@panter/vue-i18next/master/CONTRIBUTING.md##using-the-issue-tracker) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## Contribution

Please make sure to read the [Contributing Guide](https://github.com/@panter/vue-i18next/master/CONTRIBUTING.md) before making a pull request.


## License

[MIT](http://opensource.org/licenses/MIT)
