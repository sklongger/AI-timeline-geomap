<template>
  <div class="card_container" id="card-footprint">
    <transition name="card-fade">
      <slide-card class="card" :cardInfo="cardInfo" v-if="cardShow"></slide-card>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { ref, reactive, onMounted, onBeforeMount, watch, computed } from "vue";
import { TimelineType } from "@/components/timeline/renderTimeline.ts";
import { getTimeline } from "@/api/timeline.ts";
import SlideCard from "@/scenarios/dailynews/SildeCard.vue";

const store = useStore();
const cardShow = computed(() => {
  const cardShow = store.state.content.cardShow;
  if (cardShow) {
    const state = store.state.content;
    cardInfo.imgs = state.content.imgs;
    cardInfo.content = state.content.content
    cardInfo.title = state.content.title;
    cardInfo.subtitle = state.content.subtitle;
    cardInfo.date = state.content.date;
    cardInfo.locationName = state.content.locationName;
    cardInfo.website = state.content.website;
    cardInfo.titleUrl = state.content.titleUrl;
    cardInfo.organization = state.content.organization;
    cardInfo.comment = JSON.parse(state.content.comment);
    cardInfo.duration = state.content.duration;
  }
  return cardShow;
});
export interface CardInfo {
  title: string;
  subtitle: string;
  content: Array<string>;
  imgs: Array<string>;
  date: string;
  locationName: string;
  website: string;
  titleUrl: string;
  organization: string;
  comment: Array<Object>;
  duration: number;
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
  comment: [],
  duration: 0,
});

async function getTimelineData(date_str: string) {
  date_str = '2025-03-31'
  const body = {};
  let timelineType: TimelineType;
  timelineType = TimelineType.DAILYNEWS;
  const timestamp = new Date(date_str).getTime();
  body["filter"] = {
    conjunction: "and",
    conditions: [
      {
        field_name: "create_at",
        operator: "is",
        value: ["ExactDate", timestamp],
      },
      {
        field_name: "summary",
        operator: "isNotEmpty",
        value: [],
      },
      {
        field_name: "location",
        operator: "isNotEmpty",
        value: [],
      },
      {
        field_name: "date",
        operator: "isNotEmpty",
        value: [],
      }
    ],
  };
  const data: Array<Object> = await getTimeline(timelineType, body);
  store.commit("timeline/updateTimeline", {
    msgType: TimelineType.DAILYNEWS,
    updateData: data,
  });
}

onMounted(async () => {
  console.log('here here')
  await getTimelineData('2025-03-10');
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
    padding: 0px;
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

/**动画效果 左右横切*/
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
}
</style>
