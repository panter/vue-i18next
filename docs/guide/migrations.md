# Migrations

## 0.x.x => 1.x.x

### v-t

Removed the options language, we use the i18next implemantation to controll the language.

```js

// Before
{ path: 'helloPerson', language: 'de', args: { name: this.name } }

// After
{ path: 'helloPerson', args: { name: this.name, lng: 'de' } }
```

### Global option: getComponentNamespace

The option `getComponentNamespace` has been removed in favor of `componentNamespace`.

```js
// Before
const vueI18Next = new VueI18Next(i18next, {
  getComponentNamespace: () => ({ namespace: "comp-ns", loadNamespace: true })
});

// After
const vueI18Next = new VueI18Next(i18next, {
  componentNamespace: "comp-ns"
});
```
