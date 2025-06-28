<template>
  <swiper class="swiper" :effect="'cards'" :grabCursor="true" :modules="modules" :autoplay="autoplayConfig as any">
    <swiper-slide v-for="(url, index) in cardInfo.imgs">
      <div class="slide-container h-full w-full shadow-md flex-col">
        <div class="up-container flex-1/4 h-full flex items-center justify-center flex-col">
          <div class="title text-gray-500">{{ cardInfo.locationName }}: {{ cardInfo.subtitle }}</div>
          <div class="content text-gray-600 text-left px-12">{{ cardInfo.content }}</div>
        </div>
        <div class="illustration flex-2/4 ">
          <img :src="url" />
        </div>
        <div class="bottom-container flex-1/4 flex items-center justify-center w-[80%]">
          <div class="comment text-gray-600 bg-gray-100 px-3 py-2 w-full">
            <div class="avatar flex justify-start items-start mb-1 w-full">
              <img class="h-6 w-6 rounded-full" :src="`http://localhost:8080/${cardInfo.comment[index]['avatar']}.png`" />
              <div class="ml-1.5 text-[10px]">{{ cardInfo.comment[index]['nickname'] }}</div>
            </div>
            <div class="content text-left ml-7.5 -mt-2.5">{{ cardInfo.comment[index]['comment'] }}</div>
          </div>
        </div>
        
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards, Autoplay } from 'swiper/modules';
import type { AutoplayOptions } from 'swiper/types';
import { CardInfo } from '@/scenarios/dailynews/cardFootprint.vue';
import { PropType } from 'vue';
const modules = [EffectCards, Autoplay]
const props = defineProps({
  cardInfo: {
    type: Object as PropType<CardInfo>, // 使用PropType包装
    required: true // 根据实际情况设置必要性
  }
});
const autoplayConfig: AutoplayOptions = {
  delay: props.cardInfo.duration * 1000 / props.cardInfo.imgs.length,
  disableOnInteraction: false,
  stopOnLastSlide: true
};

</script>

<style scoped>
.swiper {
  height: 95%;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin: 8px;
  }
  .subtitle {
    font-size: 16px;
  }
  .illustration {
    margin: 0px auto;
    width: 100%;
    overflow: hidden;
    &>img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .comment {

  }
}

.swiper-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 12px;
  font-weight: bold;
  background: #fff;
  .slide-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
}
</style>
