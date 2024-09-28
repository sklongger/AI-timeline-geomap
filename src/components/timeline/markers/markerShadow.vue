<template>
    <div class="marker" :class="{ 'marker_active': isActive }">
        <div class='container'>
            <img class="icon" src="@/assets/icon.jpg">
            <div class="content">
                <div class="title">{{ title }}</div>
                <div class="subtitle" v-if="subtitle">{{ subtitle }}</div>
            </div>
            <div class='suffix'></div>
        </div>
    </div>
    <div class="pole">
        <div class="poleheader"></div>
        <div class="polefooter"></div>
    </div>
</template>

<script setup>
import { isMobile } from '@/../config/styleConfig.ts';
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: false
    }
});
</script>
<style scoped>
.marker {
    position: absolute;
    left: 5.5px;
    width: var(--marker-width--);
    height: var(--marker-height--);
    border-radius: 5px;
    background: rgb(11, 152, 96);
    border-radius: 0px 10px 10px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);

    .container {
        position: absolute;
        top: 0;
        height: calc(var(--marker-height--) - 6px);
        width: calc(var(--marker-width--) - 5px);
        border-radius: 4px;
        background: rgb(110, 225, 205);
        margin-left: -4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: black;
        padding: 0 4px;
        text-align: left;

        .icon {
            margin: 4px;
            width: 30px;
            height: auto;
            border-radius: 2px 40% 40% 2px;
        }

        .content {
            width: 100%;
            height: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            overflow: hidden;


            .title {
                color: #777;
                font-size: 12px;
                line-height: 12px;
                font-weight: bold;
                padding-left: 4px;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .subtitle {
                width: 90%;
                color: #888;
                font-size: 9px;
                height: 9px;
                line-height: 1;
                padding-left: 4px;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .suffix {
            /* position: absolute; */
            top: 0;
            right: 0;
            width: 4px;
            height: 80%;
            background: rgb(11, 152, 96);
            border-radius: 4px;
        }
    }
}

.marker_active {
    background: rgb(26, 170, 112);
    .container {
        background: rgb(105, 242, 219);
    }
}

.pole {
    width: 1px;
    position: absolute;
    height: calc(var(--timeline-container-height--) - 24px);
    top: 0;
    background: rgba(100, 100, 100, 0.2);
    z-index: 2;

    .polefooter {
        position: relative;
        top: calc(var(--timeline-container-height--) - 24px);
        left: -1.5px;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: rgba(0, 0, 0, 0.8);
    }

    .poleheader {
        position: absolute;
        top: 0px;
        width: 0px;
        left: -40px;
        height: 6px;
        background: rgba(0, 0, 0, 0.6);
    }
}
</style>