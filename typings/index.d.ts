import { i18n, TranslationFunction, TranslationOptions } from "i18next";
import Vue, { PluginFunction } from "vue";

declare class VueI18Next {
  constructor(i18next: i18n, options?: VueI18NextOptions);
  i18next: i18n;
  t: TranslationFunction;
  resetVm: ({  }: { i18nLoadedAt: Date }) => void;
  i18nLoadedAt: string;
  onI18nChanged: () => void;

  static install: PluginFunction<never>;
  static version: string;
}

export interface VueI18NextOptions extends TranslationOptions {
  bindI18n?: string;
  bindStore?: string;
  loadComponentNamespace?: boolean;
}

export interface VueI18NextComponentOptions {
  namespaces?: string | Array<string>;
  lng?: string;
  keyPrefix?: string;
  messages?: { [x: string]: {} };
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    i18n?: VueI18Next;
    i18nOptions?: VueI18NextComponentOptions;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    readonly $i18n: VueI18Next;
    $t: TranslationFunction;
  }
}

export default VueI18Next;
