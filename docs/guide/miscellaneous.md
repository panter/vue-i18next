# Use Vue.Filter to deal with empty keys

by: [@Fohlen](https://github.com/Fohlen)

```js
Vue.filter("t", value => {
  if (!value) return "";
  return i18n.t(value);
});
```

Usage:

```
{{ $t('some_text') }}
{{ 'some text' | t }}
```
