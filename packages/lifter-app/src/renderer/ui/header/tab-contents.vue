<template>
    <div class="tabbed-pane-header-tabs" role="tablist" aria-label="Panels">
        <div
            v-for="(name, index) in ['Auto responder', 'Rewrite rule', 'Proxy bypass domain']"
            class="tabbed-pane-header-tab"
            role="tab"
            :class="{'tabbed-pane-header-tab__selected': tabIndex === index}"
            @click="select(index)"
        >
            <span class="tabbed-pane-header-tab-title">{{name}}</span>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "tab-contents",
        computed: {
            tabIndex() {
                return this.$store.state.selectedTabIndex;
            },
        },
        methods: {
            select(selected: number) {
                this.$store.commit('changeSelectedTabIndex', selected);
            },
        },
    };
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
