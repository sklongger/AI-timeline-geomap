<template>
    <div class="earth">
        <div id="globe-container" class="globe-container">
            <transition name="globe-fade">
                <div id="globe" v-show="!cardShow"></div>
            </transition>
        </div>
        <card-news :cardShow="cardShow"></card-news>
    </div>
</template>

<script setup lang='ts'>
import * as d3 from 'd3';
import { onMounted, computed, render, h, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { EnvironmentTwoTone } from '@ant-design/icons-vue';
import CardNews from '@/components/cards/cardNews.vue';
import styleConfig from '@/../config/styleConfig.ts';

let cardShow = ref(false)
const store = useStore();
const OCEANCOLOR = styleConfig['earth']['ocean-color']
const LANDCOLOR = styleConfig['earth']['land-color']
const COUNTRYCOLOR = styleConfig['earth']['country-color']
const COUNTRYBORDER = styleConfig['earth']['country-border']
const SIZE = styleConfig['earth']['globe-size']
const X_OFFSET = SIZE / 2
const Y_OFFSET = SIZE / 2
let lat_offset = 0
let lng_offset = 0

onMounted(() => {
    const projection = d3.geoOrthographic()
        .scale(SIZE / 2 - 0.5)
        .translate([X_OFFSET, Y_OFFSET])
    const path = d3.geoPath().projection(projection);
    const svg = d3.select("#globe")
        .append("svg")
        .attr("width", SIZE)
        .attr("height", SIZE)
        .style("background-color", OCEANCOLOR)
        .style('border-radius', '50%')

    d3.json('/world.json')
        .then(data => {

            svg.append("g")
                .selectAll("path")
                .data(data['features'])
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", LANDCOLOR)
                .attr("stroke", COUNTRYCOLOR)
                .attr("stroke-width", COUNTRYBORDER);

            centerPosition(svg, projection, path, {
                location: [116, 39],
                preLocation: [116, 39]
            }, false);

            store.subscribe((mutation, state) => {
                if (mutation.type === 'content/updateContent') {
                    state = state.content
                    centerPosition(svg, projection, path, state);
                }
            });
        })
});

const centerPosition = (svg, projection, path, state, animate = true) => {
    const locationName = state.locationName;
    const longitude = state.location[0];
    const latitude = state.location[1];
    // const preLocationName = state.preLocationName;
    const preLongitude = state.preLocation[0]
    const preLatitude = state.preLocation[1]
    const pointStart = [lng_offset - preLongitude, lat_offset - preLatitude]
    const pointEnd = [lng_offset - longitude, lat_offset - latitude]

    cardShow.value = false
    svg.selectAll('foreignObject').remove();
    let arcPath = null;
    let arcIcon = null
    const arcIconSize = 20;
    let duration = 2500;
    if (!animate) {
        duration = 10;
    }
    const locate2position = () => {
        const greatArcPoints = []
        svg.transition()
            .duration(duration) // 设置动画持续时间为 2 秒
            .tween("rotate", () => {
                const interpolateRotation = d3.interpolate(pointStart, pointEnd);
                return function (t) {
                    if (arcPath) {
                        arcPath.remove()
                        arcIcon.remove()
                    }
                    projection.rotate(interpolateRotation(t));
                    svg.selectAll("path").attr("d", path);
                    const end0 = -pointStart[0] * (1 - t) - pointEnd[0] * t
                    const end1 = -pointStart[1] * (1 - t) - pointEnd[1] * t
                    if (greatArcPoints.length === 0) {
                        greatArcPoints.push([[-pointStart[0], -pointStart[1]], [end0, end1]])
                    } else {
                        const oldPoint = greatArcPoints[greatArcPoints.length - 1][1]
                        greatArcPoints.push([oldPoint, [end0, end1]])
                    }

                    const greatArc = {
                        type: "MultiLineString",
                        coordinates: greatArcPoints
                    };
                    let c_r = 5 * (1 - t) + 158
                    let c_g = 5 * t + 35
                    let c_b = 234

                    const defs = svg.append("defs");
                    const linearGradient = defs.append("linearGradient")
                        .attr("id", "myGradient")
                        .attr("x1", "0%")
                        .attr("y1", "0%")
                        .attr("x2", "100%")
                        .attr("y2", "100%")

                    linearGradient.append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", `rgb(255, 255, 0)`)

                    linearGradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", `rgb(255, 0, 0)`)

                    arcPath = svg.append("path")
                        .attr("d", path(greatArc))
                        // .attr("stroke", `rgba(${c_r}, ${c_g}, ${c_b}, ${1 - t ** 10 + 0.01})`)
                        .attr("stroke", "url(#myGradient)")
                        .attr("stroke-width", 2)
                        .attr("stroke-opacity", 1 - t ** 10 + 0.01)
                    let [offsetX, offsetY] = projection.translate()

                    arcIcon = svg.append('circle')
                        .attr('cx', offsetX)
                        .attr('cy', offsetY)
                        .attr('r', 3)
                        .attr('fill', `rgba(255, 255, 255, ${1 - t ** 10 + 0.01})`)
                        .attr('stroke', `rgba(${c_r}, ${c_g}, ${c_b}, ${1 - t ** 10 + 0.01})`)
                        .attr("stroke-width", 1.5)

                };
            })
            .on("end", () => {
                createMarker(svg, projection, path, pointEnd, locationName);
                if (arcPath) {
                    arcPath.remove()
                    arcIcon.remove()
                }
                setTimeout(() => {
                    if (animate) {
                        cardShow.value = true
                    }
                }, 1500)
            });
    }
    locate2position()
}

const createMarker = (svg, projection, path, point, locationName = '') => {
    const longitude = point[0];
    const latitude = point[1];
    const [x, y] = projection([lng_offset - longitude, lat_offset - latitude]);
    let [offsetX, offsetY] = projection.translate()
    offsetX = offsetX - SIZE / 2;
    offsetY = offsetY - SIZE / 2
    const iconSize = 30
    svg.append("foreignObject")
        .attr("x", x + offsetX - iconSize / 2)
        .attr("y", y + offsetY - iconSize)
        .attr("width", iconSize)
        .attr("height", iconSize)
        .html("<div id='marker'></div>");
    svg.append("foreignObject")
        .attr("x", x + offsetX - iconSize * 4 / 2)
        .attr("y", y + offsetY)
        .attr("width", iconSize * 4)
        .attr("height", iconSize)
        .html(`<div id='city' style='display:inline-block; white-space: nowrap; font-size:12px; color:rgba(0, 0, 0, 1);'>${locationName}</div>`);
    svg.selectAll("path").attr("d", path);
    const container = document.getElementById('marker');
    const icon = h(EnvironmentTwoTone, { spin: false, rotate: 0, style: { fontSize: '30px' } });
    render(icon, container);
}
</script>

<style scoped>
.earth {
    position: absolute;
    width: 100%;
    height: calc(100vh - 200px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;

    .globe-container {
        top: 0px;
        position: absolute;
        min-width: 100%;
        max-width: 100%;
        padding: 0 20% 0 0;
        height: calc(100vh - 220px);
        overflow: hidden;
        z-index: -1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('@/assets/background9.jpg');
        background-size: cover;
        background-position: center;

        .globe-fade-enter-active {
            transition: all 1.0s ease-out;
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
}
</style>