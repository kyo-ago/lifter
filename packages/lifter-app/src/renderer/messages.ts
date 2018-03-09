import VueI18n from "vue-i18n";

const langMapper = {
    en: "en-US",
};

const globalMessages = {
    "en-US": {
        delete: "Delete",
    },
    ja: {
        delete: "Delete",
    },
};

export const messages: VueI18n.LocaleMessages = [
    "zh-CN",
    "en",
    "de",
    "pt",
    "es",
    "da",
    "fr",
    "nb-NO",
    "zh-TW",
    "it",
    "ko",
    "ja",
    "nl",
    "vi",
    "ru-RU",
    "tr-TR",
    "pt-br",
    "fa",
    "th",
    "id",
    "bg",
    "pl",
    "fi",
    "sv-SE",
    "el",
    "sk",
    "ca",
    "cs-CZ",
    "ua",
    "tk",
    "ta",
    "lv",
    "af-ZA",
    "ee",
    "sl",
    "ar",
    "he",
    "lt",
    "mn",
    "kz",
    "hu",
    "ro",
    "ku",
].reduce((base: VueI18n.LocaleMessages, cur: string) => {
    let mappedLang = (<any>langMapper)[cur] || cur;
    base[mappedLang] = {
        ...(<any>globalMessages)[mappedLang],
        ...require(`element-ui/lib/locale/lang/${cur}`).default,
    };
    return base;
}, {});

export function getLocale(nav: { languages: string[]; language: string }): VueI18n.Locale {
    const mainLangs = ["en-US", "ja"];
    const locales = nav.languages
        .map(lang => (<any>langMapper)[lang] || lang)
        .filter(lang => mainLangs.includes(lang))
        .concat(nav.languages.filter(lang => !!messages[lang]));

    return locales[0] || (<any>langMapper)[nav.language] || nav.language;
}
