<i18n>
{
    "en-US": {
        "DropHere": "Drop here!"
    }
}
</i18n>

<template>
    <el-dialog
        title="Add auto responder"
        :visible="isAutoResponderFileDropPage"
        v-bind:fullscreen="true"
        v-bind:modal="false"
        width="95%"
        @close="unsetAutoResponderFileDropPage"
    >
        <div>
            $t("DropHere")
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { mapMutations, mapState } from 'vuex';

    export default {
        name: "auto-responder-file-drop-dialog",
        computed: {
            ...mapState([
                'isAutoResponderFileDropPage',
            ]),
        },
        methods: {
            ...mapMutations([
                'unsetAutoResponderFileDropPage',
            ]),
        },
    };
</script>

<style scoped lang="scss">
</style>
