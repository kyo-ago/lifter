<template>
    <el-table
        :data="autoResponderEntries"
        stripe
        border
    >
        <el-table-column
            prop="type"
            label="Type"
            width="60"
        />
        <el-table-column
            prop="pattern.value"
            label="Pattern"
            width="150"
        />
        <el-table-column
            prop="path.value"
            label="Path"
        />
    </el-table>
</template>

<script lang="ts">
    import {mapState} from 'vuex';

    export default {
        name: "auto-responder",
        computed: {
            ...mapState([
                'autoResponderEntries',
            ]),
        },
    };
</script>

<style scoped lang="scss">

</style>