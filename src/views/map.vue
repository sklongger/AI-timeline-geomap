<script setup>
import Timeline from '@/components/timeline/timeline.vue'
import Earth from '@/components/earth/earth.vue'
</script>
<template>
    <div class="map">
        <Timeline />
        <Earth />
    </div>
</template>

<style scoped>
.map {
    position: relative;
    height: calc(100vh - 220px);
    width: 100%;
    height: 100vh;
    padding-right: 100px;
}
</style>