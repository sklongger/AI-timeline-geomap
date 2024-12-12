<template>
  <div class="map-container">
    <div id="globe"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { onMounted } from "vue";
import regionCoordinates from '../../boundary.json';
import regionCoordinatesList from '../../result1.json';
console.log(regionCoordinatesList)

const drawRegion = (svg, path, coordinatesList) => {

    // 构造 GeoJSON 格式
    coordinatesList = coordinatesList.slice(0, 20)
    coordinatesList.forEach((coordinates) => {
        coordinates.push(coordinates[0]);

        // 绘制路径
        const pathJSON = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: coordinates
            }
        };
        let color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`
        svg.append("path")
            .datum(pathJSON)
            .attr("d", path)
            .attr("fill", color)
            .attr("stroke", 'white')
            .attr("stroke-width", 1);
        // const regionGeoJSON = {
        //     type: "Feature",
        //     geometry: {
        //         type: "Polygon",
        //         coordinates: [coordinates] // GeoJSON 坐标格式：二维数组
        //     }
        // };
        // // 绘制成随机的颜色
        // let color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.3)`
        // svg.append("path")
        // .datum(regionGeoJSON)
        // .attr("d", path)
        // .attr("fill", color) // 区域填充颜色
        // .attr("stroke", "red")               // 区域边框颜色
        // .attr("stroke-width", 2)        // 区域边框宽度
        // .attr("fill-rule", "evenodd"); 
    })
    
    // console.log(regionGeoJSON)

    // 绘制区域
    // svg.append("path")
    //     .datum(regionGeoJSON)
    //     .attr("d", path)
    //     .attr("fill", "rgba(255, 0, 0, 0.3)") // 区域填充颜色
    //     .attr("stroke", "red")               // 区域边框颜色
    //     .attr("stroke-width", 2);            // 区域边框宽度
    // 绘制路径
    // const pathJSON = {
    //     type: "Feature",
    //     geometry: {
    //         type: "LineString",
    //         coordinates: coordinates
    //     }
    // };
    // svg.append("path")
    //     .datum(pathJSON)
    //     .attr("d", path)
    //     .attr("fill", "none")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 1);
};

onMounted(() => {
  const WIDTH = 800; // 地图宽度
  const HEIGHT = 800; // 地图高度
  const CENTER_LONGITUDE = 116; // 北京经度
  const CENTER_LATITUDE = 39; // 北京纬度
  const OCEAN_COLOR = "#87CEEB"; // 海洋颜色
  const LAND_COLOR = "#228B22"; // 陆地颜色
  const BORDER_COLOR = "#FFFFFF"; // 边界线颜色

  // 创建 SVG 容器
  const svg = d3
    .select("#globe")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .style("background-color", OCEAN_COLOR)
    .style("border-radius", "50%"); // 圆形地图

  // 定义正投影
  const projection = d3
    .geoOrthographic()
    .scale(WIDTH / 1.2 - 10) // 缩放比例，确保地图填充整个容器
    .translate([WIDTH / 2, HEIGHT / 2]) // 设置中心点为 SVG 容器的中心
    .rotate([-CENTER_LONGITUDE, -CENTER_LATITUDE]); // 旋转中心到北京

  // 创建地理路径生成器
  const path = d3.geoPath().projection(projection);

  // 加载 GeoJSON 数据并绘制地图
  d3.json("/world.json").then((geoData: any) => {
    // 绘制陆地
    svg
      .append("g")
      .selectAll("path")
      .data(geoData.features) // GeoJSON 的特征集合
      .enter()
      .append("path")
      .attr("d", path) // 地理路径
      .attr("fill", LAND_COLOR) // 陆地颜色
      .attr("stroke", BORDER_COLOR) // 边界颜色
      .attr("stroke-width", 0.5); // 边界宽度

    // 在地图中心添加一个小圆点标记北京
    const [cx, cy] = projection([CENTER_LONGITUDE, CENTER_LATITUDE]);
    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 5)
      .attr("fill", "red")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);
  }).then(() => {
    // 绘制一个多边形区域
    const regionCoordinates1 = [[116, 42], [108, 38], [110, 35], [116, 42]];
    // let regionCoordinates1 = regionCoordinates.map(([i, j]) => [j, i])
    // console.log(regionCoordinates1);
    drawRegion(svg, path, regionCoordinatesList);
    // drawRegion(svg, path, regionCoordinates1);

  });
//   let regionCoordinates1 = [[116, 42], [108, 38], [110, 35], [116, 42]]
//     drawRegion(svg, path, regionCoordinates1);
});
</script>

<style scoped>
.map-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
}

#globe {
  position: relative;
}
</style>
