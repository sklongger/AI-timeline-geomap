const mobileMaxWidth = 600

const timelineStyleConfig = {
    "containerId": "timeline_container",
    "containerWidth": null,
    "containerHeight": 220,
    "activeFlag": 0,
    "offset": 0,
    "flagWidth": 150,//每个flag的宽度
    "flagMargin": null,//每个flag之间的间距
    "flagHeight": 48,
    "init": false,
    "ruler": null,
    "rulerNum": 12,//在时间轴上显示的刻度数量
    "baseLineOffset": 0.5,
    "flagOffsetWidth": 1,//最后一个flag显示多少的宽度
    "rulerMarkerWidth": 70,
    "rulerMarkers": [
        {
            "time": null,
            "position": null,
            "timeType": null,
            "content": null,
        }
    ]
}

const earthStyleConfig = {
    "ocean-color": "rgb(95,173,209)",
    "land-color": "rgb(180,225,205)",
    "country-color": "#fff",
    "country-border": 0.6,
    "background": "@/assets/background4.jpg",
    "globe-size": 1000,
    "initialZoom": 2.5,
    "mapOffset": "300px",
}

const cardStyleConfig = {
    'maxWidth': '500px',
    'cardPaddingLeft': '40%',
    'cardTitleSize': '16px',
    'cardParagraphMargin': '30px',
    'searchWidth': '40%'
}

const isMobile = window.matchMedia(`(max-width: ${mobileMaxWidth}px)`).matches

const mode = 'video' // 'website' | 'video'
// const mode = 'website' // 'website' | 'video'

if (isMobile) {
    Object.assign(timelineStyleConfig, {
        flagWidth: 106,
        flagHeight: 40,
        rulerNum: 6,
        baseLineOffset: 0.15,
        containerHeight: 180,
        flagMargin: 10,
    })
    Object.assign(earthStyleConfig, {
        "initialZoom": 2.1,
        "mapOffset": "0px",
    })

    Object.assign(cardStyleConfig, {
        maxWidth: '95vw',
        cardTitleSize: '16px',
        cardParagraphMargin: '10px',
        cardPaddingLeft: 0,
        searchWidth: '80%',
        flagOffsetWidth: 0.5,//最后一个flag显示多少的宽度
    })
}

function configStyle(): void {
    const root = document.documentElement
    root.style.setProperty('--marker-width--', `${timelineStyleConfig.flagWidth}px`)
    root.style.setProperty('--marker-height--', `${timelineStyleConfig.flagHeight}px`)
    root.style.setProperty('--timeline-container-height--', `${timelineStyleConfig.containerHeight}px`)
    root.style.setProperty('--timeline-container-width--', `${timelineStyleConfig.containerWidth}px`)

    root.style.setProperty('--card-width--', `${cardStyleConfig.maxWidth}`)
    root.style.setProperty('--card-padding-left--', `${cardStyleConfig.cardPaddingLeft}`)
    root.style.setProperty('--card-title-size--', `${cardStyleConfig.cardTitleSize}`)
    root.style.setProperty('--card-paragraph-margin--', `${cardStyleConfig.cardParagraphMargin}`)
    root.style.setProperty('--search-width--', `${cardStyleConfig.searchWidth}`)

    root.style.setProperty('--map-offset--', `${earthStyleConfig.mapOffset}`)

    root.style.setProperty('--screen-height--', window.innerHeight + 'px')
}

configStyle.call(this)

export {
    timelineStyleConfig,
    earthStyleConfig,
    cardStyleConfig,
    isMobile,
    mode
}