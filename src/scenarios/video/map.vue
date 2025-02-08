<template>
    <div v-if="inited">
        <div class="map">
            <card-footprint></card-footprint>
            <earth-footprint></earth-footprint>
            <Timeline />
        </div>
    </div>
</template>


<script setup>
import Timeline from '@/scenarios/intro/timeline.vue'
import earthFootprint from '@/scenarios/intro/earthFootprint.vue'
import cardFootprint from '@/scenarios/intro/cardFootprint.vue'
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