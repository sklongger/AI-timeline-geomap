
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import map from '@/views/map.vue';
import mapTest from '@/views/mapTest.vue';

const routes: Array<RouteRecordRaw> = [
    { path: "/", redirect: "/timemap" },
    {
        path: '/timemap',
        name: 'timemap',
        component: map
    },
    {
        path: '/mapTest',
        name: 'mapTest',
        component: mapTest
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;