<script setup>
import Timeline from '@/components/timeline/timeline.vue'
import Earth from '@/components/earth/earth.vue'
import CardNews from '@/components/cards/cardNews.vue';
</script>
<template>
    <div class="map">
        <card-news></card-news>
        <Earth />
        <Timeline />
    </div>
</template>

<style scoped>
.map {
    position: relative;
    width: 100%;
    height: var(--screen-height--);
}
</style>