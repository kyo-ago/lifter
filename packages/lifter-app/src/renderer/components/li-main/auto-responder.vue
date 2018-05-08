<template>
    <el-table
        ref="table"
        :data="autoResponders"
        :row-class-name="getTableStyle"
        border
        @row-click="selectRow"
    >
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
        <el-table-column
                label="Operations">
            <template slot-scope="scope">
                <el-button
                        size="mini"
                        type="danger"
                        @click="onClickDeleteButton(scope.row)">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import { makeTableHandlerMixin } from "../mixins/table-handler-mixin";

export default {
    name: "auto-responder",
    computed: {
        autoResponders() {
            return this.$store.state.autoResponder.entries;
        },
    },
    mixins: [
        makeTableHandlerMixin((store, entities) =>
            store.dispatch("autoResponder/deletes", entities),
        ),
    ],
};
</script>

<style scoped lang="scss">
</style>
