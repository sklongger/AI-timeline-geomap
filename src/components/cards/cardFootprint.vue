<template>
    <div class="card_container">
        <div class="search_container">
            <a-input class="search" v-model:value="person" placeholder="输入你想搜索的历史人物" @pressEnter="search" />
        </div>
        <a-modal v-model:visible="tipVisible" title="生成时空轴" @ok="goToCoze" cancelText="不去" okText="去coze">
            <p>{{ person }}的时空轴尚未生成，您可以去我们在coze搭建的agent一键生成其时空轴，并在对应的多维表格中对AI生成的时空轴进行编辑修改</p>
        </a-modal>
        <transition name="card-fade">
            <Card class="card" v-show="cardShow">
                <template #cover>

                    <div class="img-container">
                        <div v-for="(imgSrc, index) in cardInfo.imgs" :key="index" class="img-item">
                            <img :src="imgSrc" class="img-ele" />
                        </div>
                    </div>

                </template>
                <div class="content-container">
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
import { message, Card, Modal as AModal, Input as AInput } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted, onBeforeMount, watch, computed } from 'vue';
import { TimelineType } from '@/components/timeline/renderTimeline.ts';
import { getTimeline } from '@/api/timeline.ts';

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

const goToCoze = () => {
    window.open('https://www.coze.cn/space/7434842979451404299/bot/7434842561430356002', '_blank')
    tipVisible.value = false
}

const search = async () => {
    const query = { ...route.query}
    if (person.value == '') {
        message.warning('请输入人物名称')
        return
    } else {
        query['person'] = person.value
        router.replace({ query })
        await getTimelineData(person.value)
    }
}

async function getTimelineData(person: string) {
    const body = {}
    let timelineType: TimelineType
    timelineType = TimelineType.HISTORYGEOMAP
    body['person'] = person
    if (!body['person'] || body['person'] == 'demo') {
        body['person'] = 'demo'
    }
    const data = await getTimeline(timelineType, body)
    if (data.length == 0) {
        tipVisible.value = true
    } else {
        store.commit('timeline/updateTimeline', {
            msgType: TimelineType.HISTORYGEOMAP,
            updateData: data
        })
    }
}

onMounted(async () => {
    let person: string = 'demo'
    if (route.query.person) {
        person = route.query.person.toLocaleString()
    }
    await getTimelineData(person)
})
</script>

<style scoped>
.card_container {
    position: absolute;
    z-index: 1;
    width: 100vw;
    height: calc(var(--screen-height--) - var(--timeline-container-height--));
    background: rgba(0, 0, 0, 0);
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
            /* height: 50vh; */
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