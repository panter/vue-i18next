import _Vue from "vue";
import i18next, { TFunction } from "i18next";

declare module "vue/types/vue" {
    interface Vue {
        $t: TFunction;
        __key?: (key: string) => string; // local to each component with an <i18n> block
    }
}

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        __i18n?: string[]; // due to package @intlify/vue-i18n-loader, each component with at least one <i18n> block has __i18n set
    }
}

export default function install(Vue: typeof _Vue): void {
    Vue.mixin({
        beforeCreate() {
            if (!this.$options.__i18n) return;
            const name = this.$options.name;
            const rand = ((Math.random() * 10 ** 8) | 0).toString(); // each component gets its own 8-digit random namespace...
            const localNs = [name, rand].filter(x => !!x).join("-"); // ...prefixed with its name if available (for debugging purposes)

            // iterate all <i18n> blocks' contents as provided by @intlify/vue-i18n-loader and make them available to i18next
            this.$options.__i18n.forEach(bundle => {
                Object.entries(JSON.parse(bundle)).forEach(([lng, resources]) => {
                    i18next.addResourceBundle(lng, localNs, resources, true, false);
                });
            });

            // transforms a non-namespaced key into a component-scoped key
            this.__key = (key: string) => {
                const nsSeparator = i18next.options.nsSeparator;
                const includesNs = typeof nsSeparator === "string" && key.includes(nsSeparator);
                return includesNs ? key : `${localNs}:${key}`; // prefix the key with its component's local namespace if no namespace is specified
            };
        }
    });

    Vue.prototype.$t = function (this: _Vue, key: string, options?: string | Record<string, any>): string {
        return i18next.t(this.__key?.(key) ?? key, options);
    };
}
