export function makeTableHandlerMixin(deleteDispatcher: (store: any, entities: any[]) => Promise<any>) {
    return {
        data() {
            return {
                contextMenuHandler: null,
            };
        },
        methods: {
            selectRow(row) {
                if (!this.$refs.table) return;
                this.$refs.table.toggleRowSelection(row);
                return;
            },
            getTableStyle({ row, columnIndex }) {
                if (columnIndex) return "";
                if (!this.$refs.table) return "";
                if (!this.$refs.table.selection.includes(row)) return "";
                return "current-row";
            },
            onClickDeleteButton(row) {
                return deleteDispatcher(this.$store, [row]);
            },
        },
        mounted() {
            this.$data.contextMenuHandler = this.$store.state.contextMenuService.subscribe(event => {
                if (event.type !== "append") {
                    return null;
                }
                if (!this.$refs.table.selection.length) {
                    return null;
                }
                return {
                    click: () => deleteDispatcher(this.$store, this.$refs.table.selection),
                    label: this.$t("delete"),
                };
            });
        },
        async destroyed() {
            if (this.$data.contextMenuHandler) {
                await this.$data.contextMenuHandler();
                this.$data.contextMenuHandler = null;
            }
        },
    };
}
