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
    import Rx from "rxjs/Rx";
    import { VueComponent } from "../index";

    export default {
        name: "rewrite-rule",
        data() {
            return {
                shortcutHandler: null,
                contextMenuHandler: null,
            };
        },
        computed: {
            rewriteRules() {
                return this.$store.state.rewriteRule.entries;
            },
        },
        methods: {
            selectRow(row) {
                if (!this.$refs.table) return;
                this.$refs.table.toggleRowSelection(row);
                return;
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
                .filter((event: KeyboardEvent) => ["d", "delete", "backspace"].includes(event.key.toLowerCase()))
                .filter((_) => this.$refs.table.selection.length )
                .subscribe(async () => {
                    await this.$store.dispatch('rewriteRule/delete', this.$refs.table.selection);
                })
            ;

            this.$data.contextMenuHandler = this.$store.state.contextMenuService.subscribe((event) => {
                if (event.type !== "append") {
                    return null;
                }
                if (!this.$refs.table.selection.length) {
                    return null;
                }
                return {
                    click: () => {
                        this.$store.dispatch('rewriteRule/delete', this.$refs.table.selection);
                    },
                    label: this.$t("delete"),
                };
            });
        },
        async destroyed() {
            if (this.$data.shortcutHandler) {
                await this.$data.shortcutHandler.unsubscribe();
                this.$data.shortcutHandler = null;
            }
            if (this.$data.contextMenuHandler) {
                await this.$data.contextMenuHandler();
                this.$data.contextMenuHandler = null;
            }
        },
    } as VueComponent;
</script>

<style scoped lang="scss">

</style>