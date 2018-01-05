<template>
    <el-dialog
        :visible="viewSettingModalPageState"
        v-bind:fullscreen="true"
        width="95%"
        @close="close"
    >
        <div>This is a message</div>
    </el-dialog>
</template>

<script lang="ts">
    export default {
        name: "setting-dialog",
        computed: {
            viewSettingModalPageState() {
                return this.$store.state.viewSettingModalPageState;
            },
        },
        methods: {
            close() {
                this.$store.commit('hideSettingModalPage');
            },
        },
    };
</script>

<style scoped lang="scss">
</style>
