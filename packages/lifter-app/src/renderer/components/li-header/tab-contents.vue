<template>
    <div class="tab-contents" role="tablist" aria-label="Panels">
        <div
            v-for="(name, index) in ['Connection', 'Auto responder', 'Rewrite rule', 'Proxy bypass domain']"
            class="tab-content"
            role="tab"
            :class="{'tab-content__selected': selectedTabIndex === index}"
            @click="changeSelectedTabIndex(index)"
        >{{name}}</div>
    </div>
</template>

<script lang="ts">
    import { mapMutations, mapState } from 'vuex';

    export default {
        name: "tab-contents",
        computed: {
            ...mapState([
                'selectedTabIndex',
            ]),
        },
        methods: {
            ...mapMutations([
                'changeSelectedTabIndex',
            ]),
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
            border-bottom: 1.4px solid #3E82F7;
            border-left: 2px solid transparent;
        }
    }
</style>
