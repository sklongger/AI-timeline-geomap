<template>
    <div class="earth">
        <div id="globe-container" ref="chartRef" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts';
import 'echarts-gl';
import { onMounted, ref } from 'vue';

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

onMounted(async () => {
    if (!chartRef.value) return;
    
    chart = echarts.init(chartRef.value);
    
    const response = await fetch('/world.json');
    const worldGeoJson = await response.json();
    console.log(worldGeoJson);
    echarts.registerMap('world', worldGeoJson);
    
    const option = {
        backgroundColor: '#000',
        globe: {
            baseTexture: '/earth.jpg',
            heightTexture: '/bathymetry_bw_composite_4k.jpg',
            displacementScale: 0.02,
            displacementQuality: 'ultra',
            globeRadius: 100,
            environment: '#000',
            shading: 'realistic',
            realisticMaterial: {
                roughness: 0.2,
                metalness: 0
            },
            viewControl: {
                autoRotate: true,
                distance: 150,
                autoRotateSpeed: 10,
                autoRotateAfterStill: 2,
                targetCoord: [0, 0]
            },
            light: {
                main: {
                    intensity: 3,
                    shadow: false,
                    alpha: 0,
                    beta: 0
                },
                ambient: {
                    intensity: 1
                },
                ambientCubemap: {
                    texture: '/asset/canyon.hdr',
                    diffuseIntensity: 2,
                    specularIntensity: 2
                }
            },
            postEffect: {
                enable: true,
                bloom: {
                    enable: true,
                    bloomIntensity: 0.1
                },
                SSAO: {
                    enable: true,
                    quality: 'medium',
                    radius: 2
                }
            },
            temporalSuperSampling: {
                enable: true
            }
        },
        series: [{
            type: 'map3D',
            map: 'world',
            coordinateSystem: 'globe',
            data: worldGeoJson,
            shading: 'realistic',
            silent: true,
            itemStyle: {
                borderColor: 'rgba(255,255,255,0.8)',
                borderWidth: 1,
                areaColor: 'rgba(255,255,255,0.1)'
            },
            emphasis: {
                itemStyle: {
                    areaColor: 'rgba(255,255,255,0.3)'
                }
            }
        }]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => {
        chart?.resize();
    });
});
</script>

<style scoped>
.earth {
    position: absolute;
    width: 100%;
    height: calc(var(--screen-height--) - var(--timeline-container-height--));
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
        height: 100%;
        overflow: hidden;
        z-index: -1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('@/assets/background.jpg');
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