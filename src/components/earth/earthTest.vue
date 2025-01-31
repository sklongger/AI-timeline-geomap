<template>
  <div class="earth" ref="mapContainer"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import mapboxgl from "mapbox-gl";

const mapContainer = ref(null);
let map = ref(null);

onMounted(async () => {
  initMap();
});

const initMap = async () => {
  const accessToken =
    "pk.eyJ1IjoiZmdqZ2ZrIiwiYSI6ImNtNTEyOXd0bzFwbTkyam9ocG53aDdtaG4ifQ.LEuSERngbBFz1AmpVG8N0Q";
  mapboxgl.accessToken = accessToken;
  map = new mapboxgl.Map({
    container: mapContainer.value,
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
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "natural-earth-layer",
          type: "raster",
          source: "natural-earth",
          minzoom: 0,
          maxzoom: 22,
        },
      ],
      glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    },
    center: [116, 40],
    zoom: 2, // 调整缩放级别
    projection: "globe",
  });

  map.on("load", () => {
    const marker = new mapboxgl.Marker({
      color: "#000000",
      scale: 1,
    })
      .setLngLat([116, 40])
      .addTo(map);

    // 将地图中心点移动到标记的位置
    map.flyTo({
      center: [116, 40],
      zoom: 2,
    });
  });
};
</script>

<style scoped>
.earth {
  width: 100%;
  height: 500px; /* 确保容器有明确的高度 */
  z-index: 1000000;
}
</style>