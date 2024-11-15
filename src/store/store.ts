import { createStore } from 'vuex'
import { TimelineStyle } from '@/components/timeline/renderTimeline'

// 时间轴交互
const content = {
    namespaced: true,
    state: {
        preLocationName: '',
        locationName: '',
        preLocation: [116, 40],
        location: [116, 40],
        content: '',
        cardShow: false,
    },
    mutations: {
        updateContent(state, data) {
            const { content, location, locationName } = data
            state.content = content
            state.preLocation = state.location
            state.location = location
            state.preLocationName = state.locationName
            state.locationName = locationName
        },
        updateCardShowState(state, data) {
            state.cardShow = data
        }
    },
    actions: {
        updateCardShowState({ commit }, data: boolean) {
            commit('updateCardShowState', data)
        }
    }
}

// 时间轴后端数据请求
const timeline = {
    namespaced: true,
    state: {
        msgType: '',
        updateData: {}

    },
    mutations: {
        updateTimeline(state, data) {
            const { msgType, updateData } = data
            state.msgType = msgType
            state.updateData = updateData
        }
    }
}

// 动态样式
const style = {
    namespaced: true,
    state: {
        timelineStyleConfig: {} as TimelineStyle,
        earthStyleConfig: {},
        cardStyleConfig: {},
        isMobile: false
    },
    mutations: {
        updateStyle(state, data) {
            const { timelineStyleConfig, earthStyleConfig, cardStyleConfig, isMobile } = data
            state.timelineStyleConfig = timelineStyleConfig
            state.earthStyleConfig = earthStyleConfig
            state.cardStyleConfig = cardStyleConfig
            state.isMobile = isMobile
        }
    }
}



export default createStore({
    modules: {
        content,
        timeline,
        style
    },
})