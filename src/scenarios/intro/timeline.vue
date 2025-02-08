<template>
  <div id="timeline_container">
    <div class="container_background">
      <div id="toolbox" v-if="styleConfig.mode == 'website'">
        <GithubOutlined
          :style="{ fontSize: '18px', color: 'rgb(24, 144, 255)' }"
          @click="toolClick('github')"
        />
        <HomeTwoTone :style="{ fontSize: '18px' }" @click="toolClick('home')" />
        <PlayCircleTwoTone
          :style="{ fontSize: '18px' }"
          @click="toolClick('play')"
          v-if="!playing"
        />
        <PauseCircleTwoTone
          :style="{ fontSize: '18px' }"
          @click="toolClick('stop')"
          v-if="playing"
        />
        <EditTwoTone :style="{ fontSize: '18px' }" @click="toolClick('edit')" />
        <!-- <PlusCircleTwoTone :style="{ fontSize: '18px' }" @click="toolClick('magnify')" v-if="!isMobile"/>
                  <MinusCircleTwoTone :style="{ fontSize: '18px' }" @click="toolClick('reduce')" v-if="!isMobile"/> -->
      </div>
      <div
        class="baseline_v"
        :style="{ left: `${timeline['baseLineOffset'] * 100}%` }"
      ></div>
      <div class="baseline_h"></div>
      <div
        class="dragable_container"
        :style="{ left: timeline.offset + 'px' }"
        v-TimelineDrag="{ timeline: timeline, refreshFlag: refreshFlag }"
      >
        <div class="flagwraper" v-show="timelineData.init">
          <div
            v-for="(flag, index) in timelineData.flags"
            :key="index"
            v-TimelineFlag="{
              flag: flag,
              timeline: timeline,
              refreshFlag: refreshFlag,
              index: index,
            }"
            class="timeflag"
            @click="clickFlag(index)"
          >
            <MarkerShadow
              :title="flag['locationName']"
              :subtitle="flag['subtitle']"
              :isActive="index == timeline.activeFlag"
            />
          </div>

          <div
            v-for="(rulermarker, i) in timelineData.rulerMarkers"
            :key="i"
            class="rulermarker"
            :style="{ left: rulermarker.position + 'px' }"
            :class="{ year_type: rulermarker.timeType == 'year' }"
          >
            {{ rulermarker.content }}
          </div>
        </div>
        <div
          class="suffix"
          :style="{
            left:
              (timelineData.flags.length
                ? timelineData.flags.slice(-1)[0]['position'] + timeline.flagWidth * 1.5
                : -200) + 'px',
          }"
        >
          <div class="asklike">
            <img src="@/assets/icon.jpg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, watch, nextTick } from "vue";
import timelineConfig from "@/api/timeline.config_tpl.ts";
import {
  renderTimeline,
  TimelineType,
  TimelineStyle,
  TimelineData,
} from "@/components/timeline/renderTimeline.ts";
import {
  PlusCircleTwoTone,
  MinusCircleTwoTone,
  HomeTwoTone,
  PlayCircleTwoTone,
  PauseCircleTwoTone,
  GithubOutlined,
  EditTwoTone,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { recordVideo, stopRecordVideo } from "@/utils/record.ts";
import MarkerShadow from "@/components/timeline/markers/markerShadow.vue";
const store = useStore();
const route = useRoute();
const ANIMATEDURATION = 2500;

const styleConfig = computed(() => {
  return store.state.style;
});
const timelineStyleConfig = styleConfig.value.timelineStyleConfig;

let timelineData: TimelineData = structuredClone(timelineConfig);
timelineData.flags = [];
const rt = new renderTimeline(timelineData, timelineStyleConfig);
let timeline: TimelineStyle = timelineStyleConfig;
let playing = ref(false);
const refreshFlag = ref(true);

const playControl = {
  startDelay: 2000,
  // record: false,
  record: true ? styleConfig.value.mode == "video" : false,
  duration: 3,
};

onBeforeMount(async () => {
  await updateTimelineData();
  if (styleConfig.value.mode == "website") {
    await nextTick();
    renderFlags();
  } else if (styleConfig.value.mode == "video") {
    await nextTick();
    toolClick("play");
  }
});

const renderFlags = async (resetRuler: boolean = false) => {
  rt.render(resetRuler);
  await nextTick();
  refreshFlag.value = !refreshFlag.value;
  if (styleConfig.value.mode == "website") {
    console.log(styleConfig.value.mode);
    await nextTick();
    goToFlag(0);
  }
};
const clickFlag = (index) => {
  if (index != timeline.activeFlag) {
    goToFlag(index);
  }
};

const goToFlag = (index) => {
  refreshFlag.value = !refreshFlag.value;
  const flag = timelineData.flags[index];
  store.commit("content/updateContent", {
    content: flag,
    location: flag["location"],
    locationName: flag["locationName"],
  });
  timeline.activeFlag = index;
  rt.positionFlags();
};

const toolClick = async (type) => {
  if (type === "magnify" || type === "reduce") {
    rt.zoom(type);
  } else if (type === "home") {
    goToFlag(0);
  } else if (type == "play") {
    playing.value = true;
    if (styleConfig.value.mode == "video") {
      // await recordVideo();
    }

    setTimeout(() => {
      play(0);
    }, playControl.startDelay);
  } else if (type == "stop") {
    if (styleConfig.value.mode == "video") {
      // await stopRecordVideo();
    }

    playing.value = false;
  } else if (type == "github") {
    window.open("https://github.com/sklongger/AI-timeline-geomap", "_blank");
  } else if (type == "edit") {
    window.open(
      "https://gvy72b8f8g2.feishu.cn/base/Cajlby8PlakNnxsg3Vwcbb5nnOe?table=tblR6iDl2RfXsKEo&view=vewcINzc9R",
      "_blank"
    );
  }
};

const orderFlags = () => {
  let playOrder = [];
  timelineData.flags.forEach((element, index) => {
    playOrder.push({
      order: element["order"],
      index: index,
    });
  });
  playOrder.sort((a, b) => a.order - b.order);
  return playOrder;
};

const play = (index) => {
  const playOrder = orderFlags();
  const flagIndex = playOrder[index]["index"];
  let duration;

  // duration = timelineData.flags[flagIndex]["duration"] * 1000;
  duration = timelineData.flags[flagIndex]["duration"] + ANIMATEDURATION;
  goToFlag(flagIndex);
  setTimeout(() => {
    if (styleConfig.value.mode == "video") {
      index += 1;
    } else {
      index = (index + 1) % timelineData.flags.length;
    }

    if (index != timelineData.flags.length && playing.value) {
      play(index);
    } else {
      toolClick("stop");
    }
  }, duration);
};

const preloadImages = async (urlList) => {
  for (const url of urlList) {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }
};

const getTimelineData = async (data: Array<object>) => {
  // 访问路由参数
  timelineData.init = false; // 未完成初始化的时候不显示, 防止渲染时闪烁
  let preloadList = [];
  timelineData.flags = [];
  const tpl = structuredClone(timelineConfig).flags[0];
  data.forEach((element) => {
    tpl["timeStr"] = element["date"];
    tpl["title"] = element["title"];
    tpl["subtitle"] = element["subtitle"];
    tpl["content"] = element["summary"];
    tpl["imgs"] = element["imgs"];
    tpl["location"] = element["location"];
    tpl["locationName"] = element["location_str"];
    tpl["organization"] = element["organization"];
    tpl["website"] = element["website"];
    tpl["titleUrl"] = element["title_url"];
    tpl["duration"] = element["voice_duration"]
      ? element["voice_duration"]
      : playControl.duration;
    timelineData.flags.push(JSON.parse(JSON.stringify(tpl)));
    preloadList = [...preloadList, ...element["imgs"]];
  });
  refreshFlag.value = !refreshFlag.value;
  renderFlags(true);
  await nextTick();
  timelineData.init = true; // timeline初始化完毕, 可以开始显示
  await preloadImages(preloadList);
};
const updateTimelineData = async () => {
  store.subscribe(async (mutation, state) => {
    state = state.timeline;
    if (mutation.type === "timeline/updateTimeline") {
      const msgType = state.msgType;
      const updateData = state.updateData;
      switch (msgType) {
        case TimelineType.TECHNEWS:
          await getTimelineData(updateData);
          break;
        case TimelineType.HISTORYGEOMAP:
          await getTimelineData(updateData);
          break;
        default:
          break;
      }
    }
  });
};
</script>

<style scoped>
#timeline_container {
  position: absolute;
  bottom: 0px;
  box-shadow: inset 0 10px 10px 0px rgba(255, 255, 255, 0.6);
  background-size: 25px 25px;
  background-image: linear-gradient(to right, #ddd 1px, transparent 1px),
    linear-gradient(to bottom, #ddd 1px, transparent 1px);

  width: 100%;
  height: var(--timeline-container-height--);
  overflow: hidden;

  .container_background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: red; */
    background: linear-gradient(
      to right top,
      rgba(158, 35, 234, 0.6),
      rgba(50, 147, 230, 0.5),
      rgba(51, 172, 170, 0.85)
    );

    #toolbox {
      position: absolute;
      top: 4px;
      /* transform: translate(0%, -50%); */
      /* 使用translate属性水平垂直居中 */
      font-size: 12px;
      height: 85%;
      width: 30px;
      background: rgba(253, 254, 240, 1);
      display: flex;
      flex-direction: column;
      /* 设置子元素纵向排列 */
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
      box-shadow: 6px 6px 2px #ccc;
      z-index: 999;
    }

    .baseline_v {
      position: absolute;
      height: calc(100% - 24px - var(--timeline-container-offset--));
      width: 1.5px;
      left: 10%;
      background: rgb(0, 0, 0, 0.8);
      z-index: 0;
    }

    .baseline_h {
      position: absolute;
      bottom: calc(22px + var(--timeline-container-offset--));
      height: 1px;
      width: 100%;
      left: 0;
      background: rgba(225, 225, 225, 1);
      /* background: linear-gradient(to right top, rgba(51, 172, 170, 0.8), rgba(50, 147, 230, 0.2), rgba(158, 35, 234, 0.5)); */

      z-index: 2;
    }

    .dragable_container {
      cursor: move;
      position: absolute;
      height: calc(100% - 5px);
      width: 100%;
      transition: left 0.5s ease;

      .suffix {
        position: absolute;
        top: 50%;
        transform: translate(0%, -54%);

        img {
          height: 140px;
          width: 140px;
          border-radius: 50%;
        }
      }

      .rulermarker {
        font-size: 8px;
        position: absolute;
        /* bottom: 0px; */
        bottom: calc(0px + var(--timeline-container-offset--) / 2);

        z-index: 2;
        height: 14px;
        line-height: 12px;
        color: rgba(255, 255, 255, 1);
        font-weight: bold;
        text-align: center;
        width: 70px;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          background: rgba(225, 225, 225, 1);
          width: 1px;
          height: 6px;
          bottom: 18px;
        }
      }

      .year_type {
        font-size: 12px;
        width: 70px;
        height: 14px;
        color: rgba(225, 225, 225, 1);
        font-weight: 900;

        &::after {
          content: "";
          position: absolute;
          background: rgba(225, 225, 225, 1);
          width: 2px;
          height: 8px;
          bottom: 16px;
          left: 50%;
        }
      }

      .flagwraper {
        height: calc(100% - 20px);

        .timeflag {
          cursor: pointer;
          position: absolute;
        }
      }
    }
  }
}

#testbtn {
  background: rgb(31, 180, 250);
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  width: 130px;
  margin: 60px auto;
}
</style>
