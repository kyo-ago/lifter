<template>
    <el-table
        :data="clientRequestEntries"
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
    import { mapState } from 'vuex';

    export default {
        name: "connection",
        computed: {
            ...mapState([
                'clientRequestEntries',
            ]),
        },
    };
</script>

<style scoped lang="scss">

</style>
