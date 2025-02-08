<template>
  <div class="earth">
    <div class="globe-container" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import mapboxgl from "mapbox-gl";
import { centerOfMass } from "@turf/turf";

const store = useStore();
const styleConfig = computed(() => {
  return store.state.style;
});
const earthStyleConfig = styleConfig.value.earthStyleConfig;
const mapContainer = ref(null);
const markers = [];
const initialZoom = earthStyleConfig.initialZoom;
const durationMap = {
  zoomIn: 1000,
  zoomOut: 1000,
  rotate: 500,
  beforeCardShow: 500,
  afterCardHidden: 500,
  residual: 5000,
};

let map = ref(null);
let isRotating = ref(false); // 是否启用旋转
let traceInit = ref(false);
let showDelay = null;

// 初始化地图
onMounted(async () => {
  // 添加3D地球效果
  initMap();
  listenRotate();
});

const initMap = async () => {
  const accessToken =
    "pk.eyJ1IjoiZmdqZ2ZrIiwiYSI6ImNtNTEyOXd0bzFwbTkyam9ocG53aDdtaG4ifQ.LEuSERngbBFz1AmpVG8N0Q";
  mapboxgl.accessToken = accessToken;
  const geojson = await fetch("/world-ancient.json").then((response) => response.json());
  map = new mapboxgl.Map({
    container: mapContainer.value, // 绑定到DOM元素
    style: {
      version: 8,
      sources: {
        "natural-earth": {
          type: "raster",
          tiles: [
            `https://a.tiles.mapbox.com/v4/mapbox.natural-earth-2/{z}/{x}/{y}{ratio}.png?access_token=${accessToken}`,
            `https://b.tiles.mapbox.com/v4/mapbox.natural-earth-2/{z}/{x}/{y}{ratio}.png?access_token=${accessToken}`,
            `https://c.tiles.mapbox.com/v4/mapbox.natural-earth-2/{z}/{x}/{y}{ratio}.png?access_token=${accessToken}`,
          ],
          tileSize: 128,
        },
      },
      layers: [
        {
          id: "natural-earth-layer",
          type: "raster",
          source: "natural-earth",
          minzoom: 1,
          maxzoom: 4,
        },
      ],
      glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    },
    center: [116, 40], // 初始中心点
    zoom: initialZoom, // 初始缩放级别
    projection: "globe", // 使用3D地球投影
  });

  map.on("style.load", async () => {
    map.addSource("boundaries", {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: "boundaries-layer",
      type: "fill",
      source: "boundaries",
      paint: {
        "fill-color": [
          "match", // 使用 match 表达式
          ["get", "name"], // 获取 GeoJSON 中的 name 属性
          "宋",
          "rgb(233, 78, 27)",
          "宋_2",
          "rgb(233, 78, 27)",
          "契丹",
          "rgb(245, 245, 220)",
          "黠戛斯-斡朗改",
          "rgb(139, 69, 19)",
          "西夏",
          "rgb(255, 204, 0)",
          "黄头回鹘",
          "rgb(0, 128, 0)",
          "高昌回鹘",
          "rgb(25, 25, 112)",
          "大理",
          "rgb(139, 0, 0)",
          "吐蕃",
          "rgb(210, 180, 140)",
          "高丽",
          "rgb(255, 165, 0)",
          "琉球",
          "rgb(0, 100, 0)",
          "后李朝",
          "rgb(255, 223, 0)",
          "喀拉汗国",
          "rgb(205, 164, 52)",

          "#FFFFFF", // 默认颜色
        ],
        "fill-outline-color": "#FFFFFF", // 边界线颜色
        "fill-opacity": 0.6, // 填充透明度
      },
    });

    const centerPoints = geojson.features.map((feature) => {
      const center = centerOfMass(feature); // 使用 Turf.js 计算中心点
      return {
        type: "Feature",
        properties: {
          name: feature.properties.show_name, // 保留区域名称
        },
        geometry: center.geometry, // 使用中心点几何
      };
    });

    // 添加中心点数据源
    map.addSource("center-points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: centerPoints,
      },
    });

    // 添加文字图层
    map.addLayer({
      id: "center-labels",
      type: "symbol",
      source: "center-points",
      layout: {
        "text-field": ["get", "name"], // 显示区域名称
        "text-size": 12,
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-offset": [0, -0.5], // 调整文字位置
        "text-anchor": "top", // 文字锚点
      },
      paint: {
        "text-color": "#000000", // 文字颜色
        "text-halo-color": "#FFFFFF", // 文字描边颜色
        "text-halo-width": 1, // 文字描边宽度
      },
    });
  });
};

const listenRotate = () => {
  store.subscribe(async (mutation, state) => {
    if (mutation.type === "content/updateContent") {
      state = state.content;
      store.commit("content/updateCardShowState", false);
      setTimeout(async () => {
        await centerPosition(state);
      }, durationMap.afterCardHidden);
    }
  });
};

const centerPosition = async (state) => {
  const longitude = state.location[0];
  const latitude = state.location[1];
  const preLongitude = state.preLocation[0];
  const preLatitude = state.preLocation[1];
  const startPoint = [preLongitude, preLatitude];
  const endPoint = [longitude, latitude];

  clearTimeout(showDelay);
  // Remove existing markers
  markers.forEach((marker) => {
    // marker.remove();
    marker.color = "red";
  });

  // Set initial position
  map.setCenter(startPoint);

  if (!traceInit.value) {
    map.addSource("fly-trace-source", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [], // 初始为空
        },
      },
      lineMetrics: true, // 启用lineMetrics
    });

    // 添加线图层
    map.addLayer({
      id: "fly-trace-layer",
      type: "line",
      source: "fly-trace-source",
      paint: {
        // "line-color": "#FF0000", // 线的颜色
        "line-width": 1.5, // 线的宽度
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"], // 使用线的进度作为插值依据
          0,
          "#009efa", // 起点颜色
          0.5,
          "#00d2fc", // 起点颜色
          1,
          "#4ffbdf", // 终点颜色
        ],
      },
    });

    await flyToPromise(map, {
      center: startPoint,
      zoom: initialZoom + 1,
      duration: durationMap.zoomIn,
    });
  }

  let currentCoords = [startPoint]; // 当前线的坐标
  const lineSource = map.getSource("fly-trace-source");

  await flyToPromise(map, {
    center: endPoint,
    essential: true, // animation will happen even if user is interacting
    bearing: 360, // 旋转 360 度
    duration: durationMap.rotate, // 2 seconds
    easing(t) {
      const progress = t; // t是动画进度，范围是0到1
      const interpolatedLng = startPoint[0] + (endPoint[0] - startPoint[0]) * progress;
      const interpolatedLat = startPoint[1] + (endPoint[1] - startPoint[1]) * progress;
      if (traceInit.value) {
        currentCoords.push([interpolatedLng, interpolatedLat]);
      }

      lineSource.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: currentCoords,
        },
      });
      return t; //t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
  });

  addMarker(map, state, [longitude, latitude], lineSource);
  traceInit.value = true;

  showDelay = setTimeout(() => {
    // store.commit("content/updateCardShowState", true);
  }, durationMap.beforeCardShow);
};
const flyToPromise = (map, options) => {
  return new Promise((resolve, reject) => {
    map.flyTo(options).once("moveend", () => {
      resolve();
    }); // 动画结束后 resolve;
  });
};

const addMarker = (map, state, point, lineSource) => {
  const el = document.createElement("div");
  el.innerHTML = `
          <span style="white-space: nowrap; display: inline-block; font-weight:bold; color:white; font-size:12px;">${state.locationName}</span>
        `;
  let textMarker = new mapboxgl.Marker(el).setLngLat(point).setOffset([0, 10]).addTo(map);

  let locationMarker = new mapboxgl.Marker({
    color: "rgba(64, 137, 234, 1)",
    scale: 0.7,
  })
    .setLngLat(point)
    .addTo(map);

  markers.push(textMarker);
  markers.push(locationMarker);

  // setTimeout(() => {
  //   lineSource.setData({
  //     type: "Feature",
  //     properties: {},
  //     geometry: {
  //       type: "LineString",
  //       coordinates: [],
  //     },
  //   });
  // }, durationMap.residual);
};

const enableMouseRotation = () => {
  // 监听鼠标按下事件
  map.on("mousedown", () => {
    isRotating.value = true;
  });

  // 监听鼠标松开事件
  map.on("mouseup", () => {
    isRotating.value = false;
  });

  // 监听鼠标移动事件
  map.on("mousemove", (e) => {
    if (isRotating.value) {
      // 获取鼠标在地图上的位置
      const center = map.getCenter();
      const mousePos = map.project(center); // 将经纬度转换为像素坐标
      const deltaX = e.point.x - mousePos.x;

      // 根据鼠标移动的距离调整地图的旋转角度
      const bearing = map.getBearing() + deltaX * 0.1; // 调整旋转速度
      map.setBearing(bearing);
    }
  });
};

// 销毁地图
onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
.earth {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: calc(var(--screen-height--) - var(--timeline-container-height--));
  background-image: url("@/assets/background.jpg");
  /* z-index: 1000000; */
  .globe-container {
    width: calc(100% + var(--map-offset--));
    margin-left: calc(-1 * var(--map-offset--));
    height: calc(var(--screen-height--) - var(--timeline-container-height--));
  }

  .globe-fade-enter-active {
    transition: all 1s ease-out;
  }

  .globe-fade-leave-active {
    transition: all 0.9s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .globe-fade-enter-from,
  .globe-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
}
</style>
