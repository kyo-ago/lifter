<template>
    <div>
        <div class="inputContainer">
            <el-autocomplete
                    v-model="currentUrlPattern"
                    :fetch-suggestions="getUrlPatternExamples"
                    placeholder="URL Pattern (using micromatch, ex. http://example.com/)"
            />
            <el-button type="primary" icon="el-icon-edit" @click="addUrlPattern"></el-button>
        </div>
        <el-table
                ref="table"
                :data="rewriteRules"
                :row-class-name="getTableStyle"
                border
                @row-click="selectRow"
        >
            <el-table-column
                    prop="url"
                    label="URL Pattern"
                    resizable
            />
            <el-table-column
                    label="Operations"
                    width="100"
            >
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="onClickModifiersButton(scope.row.id)"
                    >Modifiers</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="onClickDeleteButton(scope.row)"
                    >Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { VueComponent } from "../index";
import { makeTableHandlerMixin } from "../mixins/table-handler-mixin";

export default {
    name: "rewrite-rule",
    data() {
        return {
            currentUrlPattern: "",
        };
    },
    methods: {
        getUrlPatternExamples(_, cb) {
            cb([
                {
                    value: "*.js",
                },
                {
                    value: "*.{js,css}",
                },
            ]);
        },
        addUrlPattern() {
            this.$store.dispatch("rewriteRule/addRule", this.$data.currentUrlPattern);
        },
        onClickModifiersButton(id: number) {
            this.$store.commit("rewriteRuleModifiersDialog/show", id);
        },
    },
    computed: {
        rewriteRules() {
            return this.$store.state.rewriteRule.entries;
        },
    },
    mixins: [makeTableHandlerMixin((store, entities) => store.dispatch("rewriteRule/deletes", entities))],
} as VueComponent;
</script>

<style scoped lang="scss">
.inputContainer {
    padding: 5px;
    display: flex;

    .el-autocomplete {
        flex: auto;
    }
}
</style>
