<template>
  <div id="globe-container" class="earth"></div>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { onMounted, computed, render, h, reactive, ref } from "vue";
import { useStore } from "vuex";
import { EnvironmentTwoTone } from "@ant-design/icons-vue";

const store = useStore();

const styleConfig = computed(() => {
  return store.state.style;
});

let map = ref(null);

onMounted(() => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZG9ubmFsaCIsImEiOiJja3czNTBraWoxbHpxMm9udG9xZGo1Z2Z2In0.Ig8zic9BAcaQUOP3NhZhsA";

  map = new mapboxgl.Map({
    container: "globe-container",
    style: {
      version: 8,
      sources: {},
      layers: [],
    },
    projection: "globe",
  });

  //天地图的token
  const tiandituToken = "d12deb9576426df9aff82075b754790a";
  const vecwUrl =
    "https://t0.tianditu.gov.cn/vec_w/wmts?" +
    "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&" +
    "TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=" +
    tiandituToken;

  const cvawUrl =
    "https://t3.tianditu.gov.cn/cva_w/wmts?" +
    "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&" +
    "TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=" +
    tiandituToken;

  function addRasterTileLayer(map, url, sourceId, layerId) {
    map.addSource(sourceId, {
      type: "raster",
      tiles: [url],
      tileSize: 256,
    });

    map.addLayer({
      id: layerId,
      type: "raster",
      source: sourceId,
    });
  }

  //2003年殷墟高解析度衛星影像
  var wmtslist = [
    {
      id: "1",
      name: "殷商",
      type: "wmts",
      tiles: [
        //商時期地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=shang-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "2",
      name: "周",
      type: "wmts",
      tiles: [
        //西周時期地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=Xijhou-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "3",
      name: "春秋",
      type: "wmts",
      tiles: [
        //春秋時期地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=spring_autumn-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "4",
      name: "秦",
      type: "wmts",
      tiles: [
        //秦代歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=bc0210-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "5",
      name: "西汉",
      type: "wmts",
      tiles: [
        //西漢歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=bc0007-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "6",
      name: "东汉",
      type: "wmts",
      tiles: [
        //東漢歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad0140-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "7",
      name: "三国",
      type: "wmts",
      tiles: [
        //三國歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad0262-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "8",
      name: "西晋",
      type: "wmts",
      tiles: [
        //西晉歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad0281-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "9",
      name: "东晋",
      type: "wmts",
      tiles: [
        //東晉歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad0382-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "10",
      name: "南北朝",
      type: "wmts",
      tiles: [
        //南北朝歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad0497-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "11",
      name: "隋",
      type: "wmts",
      tiles: [
        //隋代歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad0612-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "12",
      name: "唐",
      type: "wmts",
      tiles: [
        //唐代歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad0741-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "13",
      name: "北宋",
      type: "wmts",
      tiles: [
        //北宋歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad1111-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "14",
      name: "南宋",
      type: "wmts",
      tiles: [
        //南宋歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad1208-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "15",
      name: "元",
      type: "wmts",
      tiles: [
        //元代歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad1330-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "16",
      name: "明",
      type: "wmts",
      tiles: [
        //明代歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad1582-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "17",
      name: "清朝",
      type: "wmts",
      tiles: [
        //清代歷史地圖
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=ad1820-png-{z}-{x}-{y}",
      ],
    },
    {
      id: "18",
      name: "民国",
      type: "wmts",
      tiles: [
        //中華民國新地圖(1934)
        "https://gis.sinica.edu.tw/ccts/file-exists.php?img=spaper-png-{z}-{x}-{y}",
      ]
    }
  ];

  map.on("load", function () {
    for (let i = 0; i < wmtslist.length; i++) {
      const element = wmtslist[i];
      //历史地图
      addRasterTileLayer(map, element.tiles[0], element.id, element.id);
      map.setLayoutProperty(element.id, 'visibility', 'none');
    }

    map.setLayoutProperty("16", 'visibility', 'visible');
    //中华人民共和国天地图，我爱中国
    // addRasterTileLayer(map, vecwUrl, "vecw", "vecw");
    // addRasterTileLayer(map, cvawUrl, "cvaw", "cvaw");
  });

  //json
  map.on("style.load", function () {
    // 其他地图样式文件的相关渲染
    map.addSource("my-data", {
      // 添加 GeoJSON 数据
      type: "geojson",
      data: "/world.json",
    });
    map.addLayer({
      id: "my-data-layer",
      type: "fill",
      source: "my-data",
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.1,
      },
    });
  });
});
</script>

<style scoped>
.earth {
  position: absolute;
  width: 100%;
  height: calc(var(--screen-height--) - var(--timeline-container-height--));
  display: flex;
  top: 0px;
  margin: 0;
  transform: scale(1);
}
</style>
