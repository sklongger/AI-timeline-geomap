
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import map from '@/views/map.vue';

const routes: Array<RouteRecordRaw> = [
    { path: "/", redirect: "/timemap" },
    {
        path: '/timemap',
        name: 'timemap',
        component: map
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;