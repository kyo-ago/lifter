<template>
    <el-table
        ref="table"
        :data="autoResponderEntries"
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
            prop="pattern.value"
            label="Pattern"
            width="150"
            resizable
        />
        <el-table-column
            prop="path.value"
            label="Path"
            resizable
        />
    </el-table>
</template>

<script lang="ts">
    import Rx from 'rxjs/Rx';
    import { mapState } from 'vuex';
    import { VueComponent } from "../index";

    export default {
        name: "auto-responder",
        data() {
            return {
                shortcutHandler: null
            };
        },
        computed: {
            ...mapState([
                'autoResponderEntries',
            ]),
        },
        methods: {
            selectRow(row) {
                if (!this.$refs.table) return;
                this.$refs.table.toggleRowSelection(row);
            },
            getTableStyle({row, columnIndex}) {
                if (columnIndex) return "";
                if (!this.$refs.table) return "";
                if (!this.$refs.table.selection.includes(row)) return "";
                return "current-row";
            },
        },
        mounted() {
            this.$data.shortcutHandler = Rx.Observable
                .fromEvent(document.body, 'keyup')
                .filter((event: KeyboardEvent) => event.target === document.body)
                .filter((event: KeyboardEvent) => ["d", "backspace"].includes(event.key.toLowerCase()))
                .subscribe(async () => {
                    await this.$store.dispatch('deleteAutoResponderEntries', this.$refs.table.selection);
                })
            ;
        },
        destroyed() {
            if (this.$data.shortcutHandler) {
                this.$data.shortcutHandler.unsubscribe();
            }
        },
    } as VueComponent;
</script>

<style scoped lang="scss">

</style>