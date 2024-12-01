<template>
    <div class="card_container" id='card-footprint'>
        <div class="search_container">
            <a-input-search class="search" v-model:value="person" placeholder="输入你想搜索的历史人物" enter-button @search="search" />
        </div>
        <a-modal v-model:visible="tipVisible" title="生成时空轴" @ok="generate" cancelText="取消" okText="直接生成">
            <p>{{ person }}的时空轴尚未生成，您可以跳转我们在coze搭建的<a style="color: #1677FF" href="https://www.coze.cn/store/agent/7438913189238046720" target="_blank">历史人物智能体</a>一键生成其时空轴，并在对应的多维表格中对AI生成的时空轴进行编辑修改，或在本页点击直接生成，通常需要几分钟的等待时间</p>
        </a-modal>
        <transition name="card-fade">
            <Card class="card" v-show="cardShow">
                <template #cover>
                    <div class="img-container">
                        <div v-for="(imgSrc, index) in cardInfo.imgs" :key="index" class="img-item">
                            <img :src="imgSrc" class="img-ele" />
                        </div>
                    </div>
                    <div class="img-container-alt" v-if="cardInfo.imgs.length == 0">
                        <a-spin tip="配图资源还在生成中，请耐心等待至多几分钟...">
                        </a-spin>
                    </div>
                </template>
                
                <div class="content-container" v-if="JSON.stringify(cardInfo.content).length <= 5">
                    <a-spin tip="内容的详情还在生成中，请耐心等待至多几分钟...">
                    </a-spin>
                </div>
                <div class="content-container" v-else>
                    <div class="title">
                        {{ cardInfo.title }}
                    </div>
                    <div class="meta">
                        {{ cardInfo.subtitle }}
                    </div>
                    <div class="content">
                        <div class="content-item" v-for="content, index in cardInfo.content" :key="index">
                            {{ content }}
                        </div>
                    </div>
                </div>

            </Card>
        </transition>
    </div>

</template>

<script setup lang="ts">
import { message, Card, Modal as AModal, InputSearch as AInputSearch, Spin as ASpin } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted, onBeforeMount, watch, computed } from 'vue';
import { TimelineType } from '@/components/timeline/renderTimeline.ts';
import { getTimeline, generatePerson } from '@/api/timeline.ts';

const store = useStore()
const router = useRouter()
const route = useRoute()
const tipVisible = ref(false)
let person = ref('')

const styleConfig = computed(() => {
    return store.state.style
})
const isMobile = computed(() => {
    return store.state.style.isMobile
})

let messageKey: CallableFunction

let frameWorkInit = {
    'generate': false,
    'timeline': false,
    'imgs': false,
    'detail': false
}

const cardShow = computed(() => {
    const cardShow = store.state.content.cardShow;
    if (cardShow) {
        const state = store.state.content;
        cardInfo.imgs = state.content.imgs;
        cardInfo.content = state.content.content.split('。').map((item, index, origin) => {
            if (index != origin.length - 1) {
                item += '。'
            }
            return item
        });
        cardInfo.title = state.content.title;
        cardInfo.subtitle = state.content.subtitle;
        cardInfo.date = state.content.date;
        cardInfo.locationName = state.content.locationName;
        cardInfo.website = state.content.website;
        cardInfo.titleUrl = state.content.titleUrl;
        cardInfo.organization = state.content.organization;

    }
    return cardShow
})
interface CardInfo {
    title: string;
    subtitle: string;
    content: Array<string>;
    imgs: Array<string>;
    date: string;
    locationName: string;
    website: string;
    titleUrl: string;
    organization: string;
}

const cardInfo: CardInfo = reactive({
    title: "",
    subtitle: "",
    content: [],
    imgs: [],
    date: "",
    locationName: "",
    website: "",
    titleUrl: "",
    organization: ""
})

const generate = async() => {
    await generatePerson(person.value)
    tipVisible.value = false
    frameWorkInit = {
            'generate': true,
            'timeline': false,
            'imgs': false,
            'detail': false
        }
    store.commit('timeline/updateTimeline', {
            msgType: TimelineType.HISTORYGEOMAP,
            updateData: []
        })
    store.commit('content/updateCardShowState', false)
    await getTimelineData(person.value)
    messageKey = message.loading(`正在努力为您生成${person.value}的时空信息，需要几十秒甚至一两分钟的时间，请您耐心等待，不要重复输入...`, 0)
}

const search = async () => {
    const query = { ...route.query }
    if (person.value == '') {
        message.warning('请输入人物名称')
        return
    } else {
        query['person'] = person.value
        router.replace({ query })
        frameWorkInit = {
            'generate': false,
            'timeline': false,
            'imgs': false,
            'detail': false
        }
        await getTimelineData(person.value)
    }
}

async function getTimelineData(person: string) {
    const body = {}
    let timelineType: TimelineType
    timelineType = TimelineType.HISTORYGEOMAP
    body['person'] = person
    const data: Array<Object> = await getTimeline(timelineType, body)
    if (data.length == 0 && frameWorkInit.generate == false) {
        tipVisible.value = true
    } else {
        let switch_flag = false
        if (frameWorkInit.timeline == false && data.length > 0) {
            switch_flag = true
            frameWorkInit.timeline = true
            if (frameWorkInit.generate == true) {
                message.success(`${person}的时空框架已生成`)
            }
            if (messageKey) {
                messageKey()
            }
        }
        if (frameWorkInit.imgs == false && data.length > 0 && data[0]['imgs'].length > 0) {
            switch_flag = true
            frameWorkInit.imgs = true
            if (frameWorkInit.generate == true) {
                message.success(`${person}的配图已生成`)
            }
            
        }
        if (frameWorkInit.detail == false && data.length > 0 && data[0]['summary'].length > 0) {
            switch_flag = true
            frameWorkInit.detail = true
            if (frameWorkInit.generate == true) {
                message.success(`${person}每个时间点的内容详情已生成`)
            }
        }
        if (switch_flag) {
            store.commit('timeline/updateTimeline', {
                msgType: TimelineType.HISTORYGEOMAP,
                updateData: data
            })
        }
        if (frameWorkInit.timeline == false || frameWorkInit.imgs == false || frameWorkInit.detail == false) {
            setTimeout(() => {
                getTimelineData(person)
            }, 8000)
        }
    }
}

onMounted(async () => {
    if (route.query.person) {
        person.value = route.query.person.toLocaleString()
    }
    frameWorkInit = {
        'generate': false,
        'timeline': false,
        'imgs': false,
        'detail': false
    }
    await getTimelineData(person.value)
})
</script>

<style scoped>
.card_container {
    position: absolute;
    z-index: 1;
    width: 100vw;
    height: calc(var(--screen-height--) - var(--timeline-container-height--));
    padding: 40px 0 20px var(--card-padding-left--);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .search_container {
        position: fixed;
        width: 100%;
        top: 20px;
        left: 0;

        .search {
            margin: 0 auto;
            width: calc(var(--search-width--));
        }
    }
    
    .card {
        cursor: default;
        padding: 10px;
        box-shadow: 6px 6px 6px #ccc;
        border-radius: 10px;
        background: #e5e5e5;
        width: var(--card-width--);
        height: 90%;
        overflow-y: auto;
        border-bottom: 16px solid transparent;   

        .img-container {
            padding: 0px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .img-item {
                width: 100%;
                /* height: 100%; */
                box-sizing: border-box;

                &:last-child {
                    margin-right: 0;
                }

                .img-ele {
                    height: 100%;
                    width: 100%;
                    object-fit: contain;
                }
            }

        }

        .img-container-alt {
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 2;
        }

        .content-container {
            height: calc(0.55*(100vh - var(--timeline-container-height--) - 80px));
            display: flex;
            flex-direction: column;

            .title {
                margin: 10px auto;
                text-align: left;
                font-size: var(--card-title-size--);
                font-weight: bold;
                display: flex;
                align-items: center;
            }

            .meta {
                width: 100%;
                font-size: 12px;
                line-height: 20px;
                color: #999;
                text-align: left;
            }

            .content {
                margin-top: 8px;
                text-align: left;
                font-size: 14px;
                color: #333;
                line-height: 1.4;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;

                &>div {
                    margin-bottom: var(--card-paragraph-margin--)
                }
            }
        }
    }
}

.card-fade-enter-from,
.card-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.card-fade-enter-active {
    transition: all 0.9s ease-out;
}

.card-fade-leave-active {
    transition: all 1.0s cubic-bezier(1, 0.5, 0.8, 1);
}
</style>