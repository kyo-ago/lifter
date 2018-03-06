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
        :visible="isShowing"
        v-bind:fullscreen="true"
        v-bind:modal="false"
        width="95%"
        @close="hide"
    >
        <div>
            {{$t("DropHere")}}
        </div>
    </el-dialog>
</template>

<script lang="ts">
    export default {
        name: "file-drop-dialog",
        computed: {
            isShowing() {
                return this.$store.state.fileDropDialog.isShowing;
            },
        },
        methods: {
            hide() {
                this.$store.commit('fileDropDialog/hide');
            },
        },
    };
</script>

<style scoped lang="scss">
</style>
