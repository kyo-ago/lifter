import { RewriteRuleActionType } from "@lifter/lifter-common";

export function makeRewriteRuleModifiersMixin(
    rewriteRuleActionType: RewriteRuleActionType,
) {
    let components = undefined;
    if (global.process.env.NODE_ENV === "test") {
        components = {
            "el-input": {
                name: "el-input",
                render: () => "",
            },
            "el-table": {
                name: "el-table",
                render: () => "",
            },
            "el-autocomplete": {
                name: "el-autocomplete",
                render: () => "",
            },
        };
    }
    return {
        components,
        props: {
            rewriteRoleId: {
                type: Number,
                required: true,
            },
        },
        computed: {
            modifiers() {
                return this.$store.getters["rewriteRule/modifiers"](
                    this.rewriteRoleId,
                    rewriteRuleActionType,
                );
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
                ]);
            },
        },
    };
}
