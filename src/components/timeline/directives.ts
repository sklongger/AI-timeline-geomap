import { watchEffect, reactive } from 'vue';
const renderFlag = (el, binding) => {
    const { flag, timeline, refreshFlag, index } = binding.value
    const marker = el.querySelector('div.marker');
    Object.assign(el.style, {
        "left": flag["position"] + 'px',
        "height": timeline["flagHeight"]
    })
    const zIndex = timeline.activeFlag == index ? 999 : 10 - index
    Object.assign(marker.style, {
        "top": flag["layer"] + 'px',
        "width": timeline["flagWidth"] + 'px',
        "z-index": zIndex,
        // "background": "background: rgba(79, 251, 223, 0.8);"
    })
}

const dragTimeline = (el, binding) => {
   //TODO: 拖拽逻辑
}

export const TimelineFlag = {
    updated(el, binding) {
        renderFlag(el, binding)
    }
}

export const TimelineDrag = {
    updated(el, binding) {
        dragTimeline(el, binding)
    }
}