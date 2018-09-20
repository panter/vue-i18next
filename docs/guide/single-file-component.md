# Single file components

by [@kazupon](https://github.com/kazupon)

```html
<i18n>
  {
    "en": {
      "hello": "hello world!"
    }
  }
</i18n>

<template>
  <div id="app">
    <p>message: {{ $t('hello') }}</p>
  </div>
</template>

<script>
  export default {
    name: 'app',
  }
</script>
```

## i18n tag

To be able to use the `<i18>` you need to use the vue-loader:

```
npm install @kazupon/vue-i18n-loader --save-dev
```

```
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // you need to specify `i18n` loaders key with `vue-i18n-loader` (https://github.com/kazupon/vue-i18n-loader)
            i18n: '@kazupon/vue-i18n-loader'
          }
        }
      },
      // ...
    ]
  },
  // ...
}
```

## Use it with YAML:

```
npm install yaml-loader --save-dev
```

```html
<i18n>

en:
  hello: "hello world!"

</i18n>
```

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          preLoaders: {
            i18n: "yaml-loader"
          },
          loaders: {
            i18n: "@kazupon/vue-i18n-loader"
          }
        }
      }
      // ...
    ]
  }
  // ...
};
```
