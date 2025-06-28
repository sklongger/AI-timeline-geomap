
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import map from '@/views/map.vue';
import IntroMap from '@/scenarios/intro/map.vue';
import VideoMap from '@/scenarios/video/map.vue';
import DailyNewsMap from '@/scenarios/dailynews/map.vue';

const routes: Array<RouteRecordRaw> = [
    { path: "/", redirect: "/timemap" },
    {
        path: '/timemap',
        name: 'timemap',
        component: map
    },
    {
        path: '/scenario/intro/timemap',
        name: 'intromap',
        component: IntroMap
    },
    {
        path: '/scenario/video/timemap',
        name: 'videomap',
        component: VideoMap
    },
    {
        path: '/scenario/dailynews/timemap',
        name: 'dailynewsmap',
        component: DailyNewsMap
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;