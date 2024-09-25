import { createStore } from 'vuex';

const content = {
    namespaced: true,
    state: {
        preLocationName: '',
        locationName: '',
        preLocation: [116, 40],
        location: [116, 40],
        content: ''
    },
    mutations: {
        updateContent(state, data) {
            const { content, location, locationName } = data;
            state.content = content;
            state.preLocation = state.location
            state.location = location;
            state.preLocationName = state.locationName
            state.locationName = locationName
        }
    }
};

const timeline = {
    namespaced: true,
    state: {
        msgType: '',
        updateData: {}

    },
    mutations: {
        updateTimeline(state, data) {
            const { msgType, updateData } = data;
            state.msgType = msgType;
            state.updateData = updateData;
        }
    }
};

export default createStore({
    modules: {
        content,
        timeline
    },
});