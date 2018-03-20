import Rx from "rxjs/Rx";

export function makeTableHandlerMixin(deleteDispatcherName: string) {
    return {
        data() {
            return {
                shortcutHandler: null,
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
        },
        mounted() {
            this.$data.shortcutHandler = Rx.Observable.fromEvent(document.body, "keyup")
                .filter((event: KeyboardEvent) => event.target === document.body)
                .filter((event: KeyboardEvent) => ["d", "delete", "backspace"].includes(event.key.toLowerCase()))
                .filter(_ => this.$refs.table.selection.length)
                .subscribe(async () => {
                    await this.$store.dispatch(deleteDispatcherName, this.$refs.table.selection);
                });

            this.$data.contextMenuHandler = this.$store.state.contextMenuService.subscribe(event => {
                if (event.type !== "append") {
                    return null;
                }
                if (!this.$refs.table.selection.length) {
                    return null;
                }
                return {
                    click: () => {
                        this.$store.dispatch(deleteDispatcherName, this.$refs.table.selection);
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
    };
}
