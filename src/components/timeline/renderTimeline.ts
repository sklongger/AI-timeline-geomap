const ONEDAYMILLSECONDS = 24 * 60 * 60 * 1000;

export enum TimelineType {
    TECHNEWS = 'technews',
    HISTORYGEOMAP = 'historygeomap'
}
export interface TimelineData {
    init: boolean;//初始化后的时间轴才会显示，给template用的
    rulerMarkers: {
        content?: null | String;
        timeType?: null | String;
        time?: Date;
        position?: null | number;
    }[];
    flags: {
        timeStr: string;
        time?: Date;
        duration: number;
        location: number[];
        locationName: null | string;
        title: string;
        subtitle: string;
        organization: string;
        content: string;
        imgs: string[];
        website: string;
        titleUrl: string;
        row: string | null;
        order: number;
        position?: number | null;
        layer?: number;
    }[];
}
export interface TimelineStyle {
    containerId: string;
    containerWidth: number;
    containerHeight: number;
    activeFlag: number;
    offset: number;
    flagHeight: number;
    flagWidth: number;
    flagMargin: number;
    init: boolean;
    baseLineOffset: number;
    flagOffsetWidth: number;
    ruler?: number;
    rulerNum: number;
    rulerMarkerWidth: number;
}
export class renderTimeline {

    private flagLayer = {
        "top": null,
        "middle": null,
        "bottom": null
    }
    private dateMap = {}
    private timeline: TimelineStyle;
    private timelineData: TimelineData;

    constructor(timelineData: TimelineData, timelineStyle: TimelineStyle) {
        this.timelineData = timelineData
        this.timeline = timelineStyle
    }

    public render(resetRuler: boolean = false): void {
        const container: HTMLElement = document.getElementById(`${this.timeline.containerId}`)
        this.time2Date();
        this.timeline.containerWidth = container.offsetWidth;
        this.timeline.offset = 0;

        if (this.timeline.flagHeight == null) {
            this.timeline.flagHeight = this.timeline.containerHeight * 0.95 * 0.65 / 3;
        }

        if (this.timeline.flagMargin == null) {
            this.timeline.flagMargin = this.timeline.containerHeight * 0.9 * 0.35 / 4;
        }

        this.flagLayer["middle"] = this.timeline.flagMargin * 2 + this.timeline.flagHeight;
        this.flagLayer["top"] = this.timeline.flagMargin;
        this.flagLayer["bottom"] = this.timeline.flagMargin * 3 + this.timeline.flagHeight * 2;
        this.renderFlags(resetRuler);
    }

    public positionFlags(): void {
        let flags = this.timelineData.flags;
        let offset = flags[0].position - flags[this.timeline.activeFlag].position;
        // this.timeline.offsetOld = this.timeline.offset;
        this.timeline.offset = offset;
        this.renderRulerMarkers();
    }

    public zoom(type: string): void {
        const factor = 1.5
        if (type === 'magnify') {
            this.timeline.ruler *= factor;
            this.timeline.rulerNum *= factor
        } else if (type === 'reduce') {
            this.timeline.ruler /= factor;
            this.timeline.rulerNum /= factor
        }
    }

    private renderFlags(resetRuler: boolean = false): void {
        if (!this.timeline.ruler || resetRuler) {
            this.timeline.ruler = this.calRuler(this.timeline.containerWidth * (1 - this.timeline.baseLineOffset) - this.timeline.flagWidth * this.timeline.flagOffsetWidth);
        }
        this.setRows();
        this.renderRulerMarkers();
    }

    private time2Date() {
        const flags = this.timelineData.flags
        flags.forEach((item) => {
            let timeStr = item.timeStr
            if (timeStr.startsWith('-')) {
                timeStr = timeStr.substring(1)
                const dateArr = timeStr.split('-')
                item.time = new Date(-parseInt(dateArr[0]), parseInt(dateArr[1]) - 1, parseInt(dateArr[2]))
            } else {
                item.time = new Date(timeStr)
            }
        })
    }

    private renderRulerMarkers() {
        this.sortFlags();
        this.genRulerMarkerTime();
    }

    private genRulerMarkerTime() {
        const flags = this.timelineData.flags;
        this.dateMap = {}
        //days是半个可视时间轴的长度对应的天数，timeLevel是ruler级别，baseDay是drag块0点对应的时间相距公元1年的天数。
        var days = this.calInterval(flags[0].time, flags[flags.length - 1].time);

        var timeLevel = null;
        if (days >= 365 * 100) {
            timeLevel = "century"
        } else if (days >= 365 * 50) {
            timeLevel = "fiftyyear";
        } else if (days >= 365 * 20) {
            timeLevel = "tweentyyear";
        } else if (days >= 365 * 10) {
            timeLevel = "decade";
        } else if (days >= 365) {
            timeLevel = "year";
        } else if (days >= 30) {
            timeLevel = "month";
        } else if (days >= 1) {
            timeLevel = "day"
        }

        //前端显示的第一个时间刻度距离公元1年1月1日有多少天
        const baseDay = this.calBaseDay();
        const daysInterval = days / ((this.timeline.rulerNum - 1) / 2);
        const radius = daysInterval / 2;
        let degeneracy = false;
        var rulerMarkers = this.timelineData.rulerMarkers;
        for (let i = 0; i < this.timeline.rulerNum; i++) {
            rulerMarkers[i] = {};
            rulerMarkers[i].time = new Date();
            rulerMarkers[i].time.setTime(baseDay.getTime() + i * daysInterval * ONEDAYMILLSECONDS);
            //这部分是为了保证activeFlag总是有时间刻度显示的，但如果时间刻度刚好在两个刻度重点就回导致两个刻度都偏移到activeFlag的位置上，所以设置了简并变量，保证只有一个刻度偏移
            if (Math.abs(this.calInterval(rulerMarkers[i].time, flags[this.timeline.activeFlag].time)) <= radius && !degeneracy) {
                rulerMarkers[i].time.setTime(flags[this.timeline.activeFlag].time.getTime());
                degeneracy = true;
            }
            rulerMarkers[i].position = this.time2Position(rulerMarkers[i].time) - this.timeline.rulerMarkerWidth * 0.5;
            const { content, timeType } = this.time2Display(rulerMarkers[i].time);
            rulerMarkers[i].content = content;
            rulerMarkers[i].timeType = timeType
        }
    }

    private time2Display(dateObj: Date = null, mode: String = 'year') {
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let day = dateObj.getDate();
        let content = '';
        let timeType = ''
        if (year < 0) {
            content = "-";
            year = -year;
        }
        if (!this.dateMap[year]) {
            this.dateMap[year] = true
            switch (mode) {
                case 'full':
                    content += `${year}年${month}月${day}日`;
                    break;
                case 'year':
                    content += `${year}年`;
                    break;
                case 'month':
                    content += `${year}年${month}月`;
                    break;
                case 'day':
                    content += `${month}月${day}日`;
                    break;
                default:
                    break;
            }
            timeType = 'year'
        } else {
            content += `${month}月${day}日`;
            timeType = 'month'
        }
        return { content, timeType };
    }

    private calBaseDay() {
        //计算第一个日期和最后一个日期的天数差
        const flags = this.timelineData.flags;
        const days = this.calInterval(flags[0].time, flags[flags.length - 1].time);
        //计算时间轴显示的第一个日期（要比第一个赋值日期更早）比赋值最后一个日期早的天数
        const baseDay = new Date();
        baseDay.setTime(flags[0].time.getTime() - days * ONEDAYMILLSECONDS);
        return baseDay;
    }

    private time2Position(time: Date): number {
        const baseTime = this.timelineData.flags[0].time;
        const days = (time.getTime() - baseTime.getTime()) / ONEDAYMILLSECONDS;
        const position: number = this.timeline.containerWidth * (this.timeline.baseLineOffset) + days * this.timeline.ruler;
        return position;
    }

    private setRows(): void {
        this.timelineData.flags.forEach((flag, index, flags) => {
            flag.position = this.time2Position(flag.time);
            if (index > 0 && this.calInterval(flags[index - 1].time, flag.time) * this.timeline.ruler < this.timeline.flagWidth) {
                if (index > 1 && this.calInterval(flags[index - 2]["time"], flag["time"]) * this.timeline.ruler < this.timeline.flagWidth) {
                    flag.row = this.restRow(flags[index - 1].row, flags[index - 2].row);
                } else {
                    flag.row = this.nextRow(flags[index - 1].row);
                }
            } else {
                flag.row = "middle";
            }
            flag.layer = this.flagLayer[flag.row];
        });
    }

    private restRow(row1, row2): string {
        var rows = ["middle", "top", "bottom"];
        let index = 3 - rows.indexOf(row1) - rows.indexOf(row2);
        return rows[index];
    }

    private nextRow(row): string {
        var rows = ["middle", "top", "bottom"];
        let index = (rows.indexOf(row) + 1) % 3;
        return rows[index];
    }

    private sortFlags(): void {
        this.timelineData.flags.sort((flag1, flag2) => {
            return this.calTime(flag1["time"]) - this.calTime(flag2["time"]);
        });
    }

    /*interval单位是天*/
    private calInterval(date1, date2) {
        // 创建 Date 对象
        const start = new Date(date1);
        const end = new Date(date2);

        // 计算总毫秒数
        const timeDifference = end.getTime() - start.getTime();

        // 将毫秒数转换为天数
        const daysDifference = Math.ceil(timeDifference / ONEDAYMILLSECONDS);

        return daysDifference;
    }

    /*以公元1年1月1日为起点，极端interval*/
    private calTime(date) {
        return this.calInterval('0001-01-01', date);
    }

    /*  一天对应的长度（day=>left） */
    private calRuler(timeWidth) {
        const flags = this.timelineData.flags;
        this.sortFlags();
        let ruler = timeWidth / (this.calInterval(flags[0]["time"], flags[flags.length - 1]["time"]));
        //时间轴上flag的最大间距
        let maxSpan = 0
        let minSpan = Number.POSITIVE_INFINITY
        let scale = 1
        flags.forEach((flag, index) => {
            if (index > 2) {
                if (flags[index - 1]["time"] < flag["time"]) {
                    maxSpan = Math.max(maxSpan, this.calInterval(flags[index - 3]["time"], flag["time"]))
                    minSpan = Math.min(minSpan, this.calInterval(flags[index - 3]["time"], flag["time"]))
                }
            }
        })
        if (minSpan * ruler < this.timeline.flagWidth) {
            let scaleDown = this.timeline.flagWidth / (minSpan * ruler)
            let scaleUp = timeWidth / (maxSpan * ruler)
            if (scaleDown < scaleUp) {
                scale = scaleDown
            } else {
                scale = scaleUp
            }
        }
        return ruler * scale;
    }

}