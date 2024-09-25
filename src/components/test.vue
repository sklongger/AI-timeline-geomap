<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import timelineConfig from '../configs/timeline.config';

const timeline = ref({
    offset: 0,
    rulerMarkers: [],
});
const flags = ref([]);
const timelineData = ref(null);
const testID = ref(1);

onMounted(() => {
    renderTimeline();
});

const renderTimeline = () => {
    axios.get(`time${testID.value}.json`)
        .then(response => {
            timelineData.value = response.data;
            timeline.value = timelineData.value.timeline;
            flags.value = timelineData.value.flags;
            timeline.value.offset = 0;
            positionFlags(timelineData.value);
        });
};

const clickFlag = (index) => {
    goToFlag(index);
};

const goToFlag = (index) => {
    timeline.value.activeFlag = index;
    timeline.value.offset = timeline.value.offset - flags.value[timeline.value.activeFlag].position;
    positionFlags(timelineData.value);
    timeline.value.init = true;
};

const toolClick = (type) => {
    if (type === 'magnify') {
        timelineData.value.timeline.ruler *= 1.6;
    } else if (type === 'reduce') {
        timelineData.value.timeline.ruler /= 1.6;
    } else if (type === 'back') {
        testID.value = (testID.value + 1) % 5;
        renderTimeline();
    }
    renderFlags(timelineData.value);
};

// 拖动事件
let isDragging = false;
let startX = 0;

const onDragStart = (event) => {
    isDragging = true;
    startX = event.clientX;
};

const onDragMove = (event) => {
    if (isDragging) {
        timeline.value.offset += event.clientX - startX;
        startX = event.clientX;
    }
};

const onDragEnd = () => {
    isDragging = false;
};

// 模拟viewModel的功能，提取公共方法
const renderFlags = (data) => {
    // 处理渲染标记的逻辑
};

const positionFlags = (data) => {
    // 处理定位标记的逻辑
};
</script>
