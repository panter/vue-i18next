# vue-i18next
> Stripped-down version of the package described in <https://panter.github.io/vue-i18next/>

## Introduction

This library is a simple wrapper for [i18next](https://www.i18next.com), simplifying its use in Vue.

## Initialisation

```typescript
import Vue from "vue";
import i18next from "i18next";
import VueI18Next from "@dotbase/vue-i18next";
import App from "./App.vue";

Vue.use(VueI18Next, { i18next });

i18next.on("initialized", () => {
    new Vue({
        render: h => h(App),
    }).$mount("#app");
});

i18next.init({ ... });
```

## Usage

Using the `$t` function, which works analogously to the `t` function found in [i18next](https://www.i18next.com/overview/api#t).

```vue
<i18n>
{
    "en": {
        "insurance": "Insurance"
    },
    "de": {
        "insurance": "Versicherung"
    }
}
</i18n>

<template>
    <span>{{ $t('insurance') }}</span>
</template>
```

## Contributing

### Requirements
- node.js >= v15
