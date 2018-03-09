<template>
    <el-table
        ref="table"
        :data="autoResponders"
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
            prop="type"
            label="Type"
            align="center"
            width="60"
            resizable
        />
        <el-table-column
            prop="pattern"
            label="Pattern"
            width="150"
            resizable
        />
        <el-table-column
            prop="path"
            label="Path"
            resizable
        />
    </el-table>
</template>

<script lang="ts">
    import { VueComponent } from "../index";
    import { makeTableHandler } from "./make-table-handler";

    export default {
        name: "auto-responder",
        computed: {
            autoResponders() {
                return this.$store.state.autoResponder.entries;
            },
        },
        ...makeTableHandler("autoResponder/delete"),
    } as VueComponent;
</script>

<style scoped lang="scss">

</style>