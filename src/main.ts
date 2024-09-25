import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from '@/App.vue'
import 'ant-design-vue/dist/reset.css'
import '@/style.css'
import {TimelineFlag, TimelineDrag} from '@/components/timeline/directives.ts'
import store from '@/store/store.ts';
import router from '@/router/router.ts';

const app = createApp(App);
app.directive('TimelineFlag', TimelineFlag)
app.directive('TimelineDrag', TimelineDrag)

app.use(router)
app.use(store)
app.use(Antd)
app.mount('#app');

