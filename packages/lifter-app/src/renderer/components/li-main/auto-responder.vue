<i18n>
    {
        "en-US": {
            "delete": "Delete"
        }
    }
</i18n>

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
    import Rx from "rxjs/Rx";
    import { mapState } from "vuex";
    import { ContextMenuEvent } from "../../../domains/context-menu/context-menu-service";
    import { VueComponent } from "../index";

    export default {
        name: "auto-responder",
        data() {
            return {
                shortcutHandler: null,
                contextMenuHandler: null,
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
                .filter((event: KeyboardEvent) => ["d", "delete", "backspace"].includes(event.key.toLowerCase()))
                .filter((_) => this.$refs.table.selection.length )
                .subscribe(async () => {
                    await this.$store.dispatch('deleteAutoResponderEntries', this.$refs.table.selection);
                })
            ;

            this.$data.contextMenuHandler = this.$store.state.contextMenuService.subscribe((event: ContextMenuEvent) => {
                if (event.type !== "append") {
                    return;
                }
                if (!this.$refs.table.selection.length) {
                    return;
                }
                return {
                    click: () => {
                        this.$store.dispatch('deleteAutoResponderEntries', this.$refs.table.selection);
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