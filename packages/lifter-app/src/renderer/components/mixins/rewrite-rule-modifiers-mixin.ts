export function makeRewriteRuleModifiersMixin() {
    return {
        props: {
            "rewriteRoleId": {
                type: Number,
                required: true,
            },
            "modifiers": {
                type: Array,
                required: true,
                default: () => {
                    return [];
                },
            },
        },
        methods: {
            getHeaderExamples(_, cb) {
                cb([
                    {
                        value: "content-type",
                    },
                    {
                        value: "content-length",
                    },
                    {
                        value: "cookie",
                    },
                    {
                        value: "origin",
                    },
                ])
            },
        },
    };
}
