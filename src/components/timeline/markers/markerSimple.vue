<template>
    <div class="marker" :class="{ 'marker_active': isActive }">
        <img class="icon" src="@/assets/icon.jpg">
        <div class='content'>{{ title }}</div>
    </div>
    <div class="pole">
        <div class="poleheader"></div>
        <div class="polefooter"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: false
    }
});
</script>
<style scoped>
.marker {
    position: absolute;
    border-radius: 5px;
    background: linear-gradient(to bottom, rgba(181, 228, 207, 0.95), rgba(181, 228, 207, 0.85));
    border-radius: 0px 10px 10px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 99.5%;
        height: 100%;
        border-radius: 0px 10px 10px 0px;
    }

    .icon {
        margin: 4px;
        width: 35px;
        height: auto;
    }

    .content {
        color: black;
        padding: 0 4px;
        text-align: left;
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        line-height: 40px;
    }
}

.marker_active {
    background: rgba(167, 247, 139, 1);
    /* z-index: 999; */
}

.pole {
    width: 1px;
    position: absolute;
    height: 190px;
    top: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 101;

    .polefooter {
        position: relative;
        top: 190px;
        left: -1.5px;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: rgb(0, 0, 0);
    }

    .poleheader {
        position: absolute;
        top: 0px;
        width: 0px;
        left: -40px;
        height: 6px;
        background: rgba(0, 0, 0, 0.6);
    }
}
</style>