<template>
    <transition name="card-fade" class="card">
        <a-card hoverable v-show="cardShow">
            <template #cover>
                <div class="img-container">
                    <div v-for="(imgSrc, index) in cardInfo.cardImgs" :key="index" class="img-item">
                        <img alt="example" :src="imgSrc" />
                    </div>
                </div>
            </template>
            <a-card-meta :title="cardInfo.cardTitle">
                <template #description>
                    {{ cardInfo.cardContent }}
                </template>
            </a-card-meta>
        </a-card>
    </transition>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue';

const props = defineProps({
    cardShow: {
        type: Boolean,
        default: false
    }
});

const store = useStore();
interface CardInfo {
    cardTitle: string;
    cardContent: string;
    cardImgs: Array<string>;
}

const cardInfo: CardInfo = reactive({
    cardTitle: "",
    cardContent: "",
    cardImgs: []
})
watch(() => props.cardShow, (newVal) => {
    if (newVal) {
        const state = store.state;
        cardInfo.cardImgs = state.content.imgs;
        cardInfo.cardContent = state.content.content;
        cardInfo.cardTitle = state.content.title;
    }
})
</script>

<style scoped>
.card {
    padding: 10px;
    background: white;
    box-shadow: 6px 6px 6px #ccc;
    border-radius: 10px;

    .img-container {
        display: flex;
        align-items: center;
        /**水平剧中 */
        justify-content: center;

        .img-item {
            margin-right: 10px;

            /* 最后一个元素margin-right为0*/
            &:last-child {
                margin-right: 0;
            }

            height: 100%;

            &>img {
                max-height: calc(80vh - 220px);
                object-fit: cover;
                border-radius: 5px;
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