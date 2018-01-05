<template>
    <div class="tabbed-pane-header-tabs" role="tablist" aria-label="Panels">
        <div
                class="tabbed-pane-header-tab"
                role="tab"
                v-on:click="select(0)"
                :class="{'tabbed-pane-header-tab__selected': selectedTabIndex === 0}"
        >
            <span class="tabbed-pane-header-tab-title">Auto responder</span>
        </div>
        <div
                class="tabbed-pane-header-tab"
                role="tab"
                v-on:click="select(1)"
                :class="{'tabbed-pane-header-tab__selected': selectedTabIndex === 1}"
        >
            <span class="tabbed-pane-header-tab-title">Rewrite rule</span>
        </div>
        <div
                class="tabbed-pane-header-tab"
                role="tab"
                v-on:click="select(2)"
                :class="{'tabbed-pane-header-tab__selected': selectedTabIndex === 2}"
        >
            <span class="tabbed-pane-header-tab-title">Proxy bypass domain</span>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "tab-contents",
        data() {
            return {
                selectedTabIndex: 0,
            };
        },
        methods: {
            select(selected: number) {
                this.selectedTabIndex = selected;
            }
        }
    }
</script>

<style scoped lang="scss">
    .tabbed-pane-header-tabs {
        display: flex;
    }

    .tabbed-pane-header-tab {
        pointer-events: initial;
        float: left;
        line-height: 15px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        color: #5a5a5a;
        cursor: pointer;
        background: #f3f3f3;
        border: none;
        padding: 2px 0.8em;
        height: 26px;
        margin: 0;

        &:hover {
            color: #333;
            background-color: #e5e5e5;
        }

        &__selected {
            height: 26px;
            margin: 0;
            color: #333;

            border-top-width: 0;
            border-right: 2px solid transparent;
            border-bottom: 1.4px solid #3E82F7;
            border-left: 2px solid transparent;
        }
    }

    .tabbed-pane-header-tab-title {
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
