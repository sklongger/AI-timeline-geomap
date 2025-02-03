<template>
  <div class="card_container" id="card-footprint">
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
        </div>
      </Card>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  message,
  Card,
  Modal as AModal,
  InputSearch as AInputSearch,
  Spin as ASpin,
} from "ant-design-vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, onMounted, onBeforeMount, watch, computed } from "vue";
import { TimelineType } from "@/components/timeline/renderTimeline.ts";
import { getTimeline, generatePerson } from "@/api/timeline.ts";

const store = useStore();
const router = useRouter();
const route = useRoute();
const tipVisible = ref(false);
let person = ref("");

const styleConfig = computed(() => {
  console.log(store.state.style);
  return store.state.style;
});

const cardShow = computed(() => {
  const cardShow = store.state.content.cardShow;
  if (cardShow) {
    const state = store.state.content;
    cardInfo.imgs = state.content.imgs;
    cardInfo.content = state.content.content.split("。").map((item, index, origin) => {
      if (index != origin.length - 1) {
        item += "。";
      }
      return item;
    });
    cardInfo.title = state.content.title;
    cardInfo.subtitle = state.content.subtitle;
    cardInfo.date = state.content.date;
    cardInfo.locationName = state.content.locationName;
    cardInfo.website = state.content.website;
    cardInfo.titleUrl = state.content.titleUrl;
    cardInfo.organization = state.content.organization;
  }
  return cardShow;
});
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
  organization: "",
});

const getTimelineData = async (person: string) => {
  const body = {};
  body["person"] = person;
  const data: Array<Object> = await getTimeline(TimelineType.HISTORYGEOMAP, body);
  store.commit("timeline/updateTimeline", {
    msgType: TimelineType.HISTORYGEOMAP,
    updateData: data,
  });
};

onMounted(async () => {
  if (route.query.person) {
    person.value = route.query.person.toLocaleString();
  }
  await getTimelineData(person.value);
});
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

  .card {
    cursor: default;
    padding: 10px;
    box-shadow: 6px 6px 6px #ccc;
    border-radius: 10px;
    background: #e5e5e5;
    width: var(--card-width--);

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
          display: block;
          height: 100%;
          width: 100%;
          object-fit: contain;
        }
      }
    }

    .content-container {
      display: flex;
      flex-direction: column;

      .title {
        margin: 4px auto;
        text-align: left;
        font-size: var(--card-title-size--);
        font-weight: bold;
        display: flex;
        align-items: center;
      }

      .meta {
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        color: #999;
        text-align: left;
      }
    }
  }
}


/**左右淡入淡出 */
/*
.card-fade-enter-from,
.card-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.card-fade-enter-active {
  transition: all 0.9s ease-out;
}

.card-fade-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}*/


.card-fade-enter-from {
    opacity: 0;
    transform: scale(0);
}

.card-fade-enter-active {
    transition: all 0.3s ease-out;
}

.card-fade-enter-to {
    opacity: 1;
    transform: scale(1);
}

.card-fade-leave-from {
    opacity: 1;
  transform: scale(1);
}

.card-fade-leave-active {
    transition: all 0.5s ease-in;
}

.card-fade-leave-to {
    opacity: 0;
  transform: scale(0.8); /* 可选：离开时增加轻微缩小效果 */
}
</style>
