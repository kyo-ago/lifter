<template>
    <el-table
        :data="clientRequests"
        stripe
        border
    >
        <el-table-column
            prop="href"
            label="href"
        ></el-table-column>
    </el-table>
</template>

<script lang="ts">
export default {
    name: "connection",
    components: global.process.env.NODE_ENV === "test" ? {
        "el-table": {
            name: "el-table",
            render: () => "",
        }
    } : {},
    computed: {
        clientRequests() {
            return this.$store.state.clientRequest.entries;
        },
    },
};
</script>

<style scoped lang="scss">
</style>
