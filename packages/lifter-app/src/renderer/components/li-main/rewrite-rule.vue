<template>
    <div>
        <el-table
                ref="table"
                :data="rewriteRules"
                :row-class-name="getTableStyle"
                border
                @row-click="selectRow"
        >
            <el-table-column
                    type="selection"
                    align="center"
                    width="55"
                    resizable
            />
            <el-table-column
                    prop="action"
                    label="Action"
                    align="center"
                    width="60"
                    resizable
            />
            <el-table-column
                    prop="url"
                    label="URL"
                    width="150"
                    resizable
            />
            <el-table-column
                    prop="header"
                    label="Header"
                    resizable
            />
            <el-table-column
                    prop="value"
                    label="Value"
                    resizable
            />
        </el-table>
        <el-autocomplete
                v-model="currentUrlPattern"
                :fetch-suggestions="getUrlPatternExamples"
                placeholder="URL Pattern (using micromatch, ex. http://example.com/)"
        />
        <el-button type="primary" icon="el-icon-edit" @click="addUrlPattern"></el-button>
    </div>
</template>

<script lang="ts">
    import { VueComponent } from "../index";
    import { makeTableHandlerMixin } from "./table-handler-mixin";

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
                        value: "*.js"
                    },
                    {
                        value: "*.{js,css}"
                    },
                ])
            },
            addUrlPattern() {
                this.$store.dispatch("rewriteRule/addRule", this.$data.currentUrlPattern);
            },
        },
        computed: {
            rewriteRules() {
                return this.$store.state.rewriteRule.entries;
            },
        },
        mixins: [
            makeTableHandlerMixin("rewriteRule/delete"),
        ],
    } as VueComponent;
</script>

<style scoped lang="scss">

</style>