<template>
    <div class="tab-contents" role="tablist" aria-label="Panels">
        <div
            v-for="(name, index) in HeaderTabs"
            class="tab-content"
            role="tab"
            :class="{'tab-content__selected': selectedTabIndex === index}"
            @click="changeTabIndex(index)"
        >{{name}}</div>
    </div>
</template>

<script lang="ts">
import { HeaderTabs } from "../../store/modules/get-header-tab-module";

export default {
    name: "tab-contents",
    data: () => ({
        HeaderTabs: HeaderTabs,
    }),
    computed: {
        selectedTabIndex() {
            return this.$store.state.headerTab.index;
        },
    },
    methods: {
        changeTabIndex(index: number) {
            this.$store.commit("headerTab/changeIndex", index);
        },
    },
};
</script>

<style scoped lang="scss">
.tab-contents {
    display: flex;
    flex-grow: 1;
    flex-basis: 0;
    overflow: hidden;
}

.tab-content {
    line-height: 15px;
    white-space: nowrap;
    color: #5a5a5a;
    cursor: pointer;
    background: #f3f3f3;
    border: none;
    padding: 2px 0.8em;
    height: 100%;
    margin: 0;

    &:hover {
        color: #333;
        background-color: #e5e5e5;
    }

    &__selected {
        margin: 0;
        color: #333;

        border-top-width: 0;
        border-right: 2px solid transparent;
        border-bottom: 1.4px solid #3e82f7;
        border-left: 2px solid transparent;
    }
}
</style>
