<template>
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
</template>

<script lang="ts">
    import { VueComponent } from "../index";
    import { makeTableHandler } from "./make-table-handler";

    export default {
        name: "rewrite-rule",
        computed: {
            rewriteRules() {
                return this.$store.state.rewriteRule.entries;
            },
        },
        ...makeTableHandler("rewriteRule/delete"),
    } as VueComponent;
</script>

<style scoped lang="scss">

</style>