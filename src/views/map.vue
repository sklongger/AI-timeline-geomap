<template>
    <div v-if="inited">
        <div class="map" v-if="appName == 'technews'">
            <card-news></card-news>
            <earth-news></earth-news>
            <Timeline />
        </div>

        <div class="map" v-if="appName == 'historygeomap'">
            <card-footprint></card-footprint>
            <!-- <earth-footprint></earth-footprint> -->
            <!-- <earth-footprint-gl></earth-footprint-gl> -->
            <earth-footprint-mapbox></earth-footprint-mapbox>
            <Timeline />
        </div>
    </div>
</template>


<script setup>
import Timeline from '@/components/timeline/timeline.vue'
import EarthNews from '@/components/earth/earthNews.vue'
import CardNews from '@/components/cards/cardNews.vue'
import EarthFootprint from '@/components/earth/earthFootprint.vue'
import EarthFootprintGl from '@/components/earth/earthFootprintGl.vue'
import EarthFootprintMapbox from '@/components/earth/earthFootprintMapbox.vue'
import cardFootprint from '@/components/cards/cardFootprint.vue'
import { loadStyle } from '@/styleConfig/loadStyle.ts'

import { onMounted, onBeforeMount, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const route = useRoute()
const router = useRouter()
const store = useStore()
const appName = computed(() => {
    return route.query.appName;
})
let inited = ref(false)

const styleConfig = computed(() => {
    return store.state.style
})

onMounted(async () => {
    await loadStyle(route.query.appName, store)
    inited.value = true
})
</script>
<style scoped>
.map {
    position: relative;
    width: 100%;
    height: var(--screen-height--);
}
</style>