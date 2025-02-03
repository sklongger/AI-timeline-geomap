
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import map from '@/views/map.vue';
import IntroMap from '@/scenarios/intro/map.vue';

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
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;