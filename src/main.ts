import { createApp } from 'vue'
import App from '@/App.vue'
import 'ant-design-vue/dist/reset.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import '@/style.css'
import VueGtag from "vue-gtag";

import {TimelineFlag, TimelineDrag} from '@/components/timeline/directives.ts'
import store from '@/store/store.ts';
import router from '@/router/router.ts';


const app = createApp(App);
app.directive('TimelineFlag', TimelineFlag)
app.directive('TimelineDrag', TimelineDrag)

app.use(router)
app.use(store)
app.use(VueGtag, {
    config: { id: "G-681L29M480" }
  })
app.mount('#app');

