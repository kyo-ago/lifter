import VueI18n from 'vue-i18n';

const langMapper = {
    "en": "en-US",
};

export const messages: VueI18n.LocaleMessages = [
    "zh-CN", "en", "de", "pt", "es", "da", "fr", "nb-NO",
    "zh-TW", "it", "ko", "ja", "nl", "vi", "ru-RU", "tr-TR",
    "pt-br", "fa", "th", "id", "bg", "pl", "fi", "sv-SE",
    "el", "sk", "ca", "cs-CZ", "ua", "tk", "ta", "lv",
    "af-ZA", "ee", "sl", "ar", "he", "lt", "mn", "kz",
    "hu", "ro", "ku"
].reduce((base: VueI18n.LocaleMessages, cur: string) => {
    base[langMapper[cur] || cur] = require(`element-ui/lib/locale/lang/${cur}`).default;
    return base;
}, {});

const mainLangs = [
    "en-US", "ja",
];
const locales = navigator.languages
    .filter((lang) => mainLangs.includes(lang))
    .concat(navigator.languages.filter((lang) => !!messages[lang]))
;

export const locale: VueI18n.Locale = locales[0] || navigator.language;
