<template>
    <div class="tabbed-pane-header-tabs" role="tablist" aria-label="Panels">
        <div class="tabbed-pane-header-tab__selected" role="tab">
            <span class="tabbed-pane-header-tab-title">Auto responder</span>
        </div>
        <div class="tabbed-pane-header-tab" role="tab">
            <span class="tabbed-pane-header-tab-title">Rewrite rule</span>
        </div>
        <div class="tabbed-pane-header-tab" role="tab">
            <span class="tabbed-pane-header-tab-title">Proxy bypass domain</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tab-contents"
    }
</script>

<style scoped lang="scss">
    @mixin tab() {
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
    }

    .tabbed-pane-header-tabs {
        display: flex;
    }

    .tabbed-pane-header-tab {
        @include tab;

        &__selected {
            @include tab;
            border-width: 0 2px 0 2px;
            height: 26px;
            margin: 0;
            border-left: 2px solid transparent;
            border-right: 2px solid transparent;
            color: #333;

            border-bottom-color: #3E82F7;
            border-bottom-style: solid;
            border-bottom-width: 1.4px;
        }
    }

    .tabbed-pane-header-tab-title {
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
