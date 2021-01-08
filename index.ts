import _Vue from "vue";
import { i18n, TFunction } from "i18next";

declare module "vue/types/vue" {
    interface Vue {
        $t: TFunction;
        $i18next: i18n;

        __bundles?: Array<[string, string]>;  // the bundles loaded by the component
        __key?: (key: string) => string; // local to each component with an <i18n> block
    }
}

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        __i18n?: string[]; // due to package @intlify/vue-i18n-loader, each component with at least one <i18n> block has __i18n set
    }
}

interface VueI18NextOptions {
    i18next: i18n;
}

export default function install(Vue: typeof _Vue, { i18next }: VueI18NextOptions): void {
    Vue.mixin({
        beforeCreate() {
            if (!this.$options.__i18n) return;

            // each component gets its own 8-digit random namespace prefixed with its name if available
            const name = this.$options.name;
            const rand = ((Math.random() * 10 ** 8) | 0).toString();
            const localNs = [name, rand].filter(x => !!x).join("-");

            // used to store added resource bundle identifiers for later removal upen component destruction
            this.__bundles = [];

            // iterate all <i18n> blocks' contents as provided by @intlify/vue-i18n-loader and make them available to i18next
            this.$options.__i18n.forEach(bundle => {
                Object.entries(JSON.parse(bundle)).forEach(([lng, resources]) => {
                    i18next.addResourceBundle(lng, localNs, resources, true, false);
                    this.__bundles!.push([lng, localNs]);
                });
            });

            // transforms a non-namespaced key into a component-scoped key
            this.__key = (key: string) => {
                const nsSeparator = i18next.options.nsSeparator;
                const includesNs = typeof nsSeparator === "string" && key.includes(nsSeparator);
                return includesNs ? key : `${localNs}:${key}`; // prefix the key with its component's local namespace if no namespace is specified
            };
        },
        destroyed(this: _Vue) {
            this.__bundles?.forEach(([lng, ns]) => i18next.removeResourceBundle(lng, ns)); // avoid memory leaks
        }
    });

    Vue.prototype.$t = function (this: _Vue, key: string, options?: string | Record<string, any>): string {
        return i18next.t(this.__key?.(key) ?? key, options);
    };
}
