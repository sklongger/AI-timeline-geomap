
const ONEDAYMILLSECONDS = 24 * 60 * 60 * 1000
export interface TimelineData {
    timeline: {
        containerId: string;
        containerWidth: number;
        containerHeight: number;
        activeFlag: number;
        offset: number;
        flagWidth: number;
        init: boolean;
        baseLineOffset: number;
        flagOffsetWidth: number;
        ruler?: number;
        rulerNum: number;
        rulerMarkerWidth: number;
        rulerMarkers: {
            content: null | String;
            timeType: null | String;
            time: null | string;
            position: null | number;
        }[];
        control: {
            startDelay: number,
            record: boolean,
            duration: number,
        },
    };
    flags: {
        time: string;
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
        row: number | "middle" | null;
        order: number;
    }[];
}
export class renderTimeline {
    private entity;
    private ruler;
    private flagLayer = {
        "top": null,
        "middle": null,
        "bottom": null
    }
    private dateMap = {}

    public render(timelineData: TimelineData) {
        let timeline = timelineData["timeline"];
        this.time2Date(timelineData);
        const container = document.getElementById(`${timeline['containerId']}`)
        timeline["containerWidth"] = container.offsetWidth;
        timeline["containerHeight"] = timeline['containerHeight'];
        timeline["offset"] = 0;
        timeline["offsetOld"] = 0;

        timeline["flagHeight"] = timeline["containerHeight"] * 0.95 * 0.65 / 3;
        timeline["flagMargin"] = timeline["containerHeight"] * 0.9 * 0.35 / 4;

        this.flagLayer["middle"] = timeline["flagMargin"] * 2 + timeline["flagHeight"];
        this.flagLayer["top"] = timeline["flagMargin"];
        this.flagLayer["bottom"] = timeline["flagMargin"] * 3 + timeline["flagHeight"] * 2;
        this.renderFlags(timelineData);
    }

    public renderFlags(timelineData: TimelineData) {
        let timeline = timelineData["timeline"];
        let flags = timelineData["flags"];
        if (!timeline["ruler"]) {
            this.ruler = this.calRuler(flags, timeline["containerWidth"] * (1 - timeline['baseLineOffset']) - timeline["flagWidth"] * timeline["flagOffsetWidth"]);
            timeline["ruler"] = this.ruler;
        } else {
            this.ruler = timeline["ruler"];
        }

        this.setRows(flags, timeline);
        this.renderRulerMarkers(timelineData);
    }

    public positionFlags(timelineData) {
        let timeline = timelineData["timeline"];
        let flags = timelineData["flags"];
        let offset = flags[0]["position"] - flags[timeline["activeFlag"]]["position"];
        timeline['offsetOld'] = timeline['offset'];
        timeline["offset"] = offset;
        this.renderRulerMarkers(timelineData);
    }

    private time2Date(timelineData) {
        const flags = timelineData['flags']
        flags.forEach((item) => {
            item['time'] = new Date(item['time'])
        })
    }

    private renderRulerMarkers(timelineData) {
        var timeline = timelineData["timeline"];
        var flags = timelineData["flags"];
        this.sortFlags(flags);
        this.genRulerMarkerTime(timeline, flags);
    }

    private genRulerMarkerTime(timeline, flags) {
        this.dateMap = {}
        //days是半个可视时间轴的长度对应的天数，timeLevel是ruler级别，baseDay是drag块0点对应的时间相距公元1年的天数。
        var days = this.calInterval(flags[0]["time"], flags[flags.length - 1]["time"]);

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
        const baseDay = this.calBaseDay(timeline, flags);
        const daysInterval = days / ((timeline["rulerNum"] - 1) / 2);
        const radius = daysInterval / 2;
        var rulerMarkers = timeline["rulerMarkers"];
        for (let i = 0; i < timeline["rulerNum"]; i++) {
            let _rulerMarker = {
                "time": null,
                "position": null,
                "content": null
            };

            rulerMarkers[i] = _rulerMarker;
            rulerMarkers[i]["time"] = new Date();
            rulerMarkers[i]["time"].setTime(baseDay.getTime() + i * daysInterval * ONEDAYMILLSECONDS);
            if (Math.abs(this.calInterval(rulerMarkers[i]["time"], flags[timeline["activeFlag"]]["time"])) <= radius) {
                rulerMarkers[i]["time"].setTime(flags[timeline["activeFlag"]]["time"].getTime());
            }
            rulerMarkers[i]["position"] = this.time2Position(rulerMarkers[i]["time"], flags, timeline) - timeline['rulerMarkerWidth'] * 0.5;//rulerMarkers[i]["time"] * timeline["ruler"];
            const { content, timeType } = this.time2Display(rulerMarkers[i]["time"]);
            rulerMarkers[i]["content"] = content;
            rulerMarkers[i]["timeType"] = timeType
        }
    }

    private time2Display(dateObj) {
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let day = dateObj.getDate();
        let content = '';
        let timeType = ''
        if (year < 0) {
            content = "BC";
            year = -year;
        }
        if (!this.dateMap[year]) {
            this.dateMap[year] = true
            content += `${year}年${month}月${day}日`;
            timeType = 'year'
        } else {
            content += `${month}月${day}日`;
            timeType = 'month'
        }
        return { content, timeType };
    }

    private calBaseDay(timeline, flags) {
        //计算第一个日期和最后一个日期的天数差
        const days = this.calInterval(flags[0]["time"], flags[flags.length - 1]["time"]);
        //计算时间轴显示的第一个日期（要比第一个赋值日期更早）比赋值最后一个日期早的天数
        const baseDay = new Date();
        baseDay.setTime(flags[0]['time'].getTime() - days * ONEDAYMILLSECONDS);
        return baseDay;
    }

    private time2Position(time, flags, timeline) {
        const baseTime = flags[0]["time"];
        const days = (time.getTime() - baseTime.getTime()) / ONEDAYMILLSECONDS;
        const position = timeline["containerWidth"] * (timeline['baseLineOffset']) + days * this.ruler;
        return position;
    }

    private setRows(flags, timeline) {

        var baseTime = flags[0]["time"];
        flags.forEach((flag, index, flags) => {
            // flag["position"] = timeline["containerWidth"] * 1.5 + this.calInterval(baseTime, flag["time"]) * this.ruler;

            flag["position"] = this.time2Position(flag["time"], flags, timeline);
            if (index > 0 && this.calInterval(flags[index - 1]["time"], flag["time"]) * this.ruler < timeline["flagWidth"]) {
                if (index > 1 && this.calInterval(flags[index - 2]["time"], flag["time"]) * this.ruler < timeline["flagWidth"]) {
                    flag["row"] = this.restRow(flags[index - 1]["row"], flags[index - 2]["row"]);
                } else {
                    flag["row"] = this.nextRow(flags[index - 1]["row"]);
                }
            } else {
                flag["row"] = "middle";
            }
            flag["layer"] = this.flagLayer[flag["row"]];
        });
    }

    private restRow(row1, row2) {
        var rows = ["middle", "top", "bottom"];
        let index = 3 - rows.indexOf(row1) - rows.indexOf(row2);
        return rows[index];
    }

    private nextRow(row) {
        var rows = ["middle", "top", "bottom"];
        let index = (rows.indexOf(row) + 1) % 3;
        return rows[index];
    }

    private sortFlags(flags) {
        flags.sort((flag1, flag2) => {
            return this.calTime(flag1["time"]) - this.calTime(flag2["time"]);
        });
        return flags;
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
    private calRuler(flags, timeWidth) {
        this.sortFlags(flags);
        let ruler = timeWidth / (this.calInterval(flags[0]["time"], flags[flags.length - 1]["time"]));
        return ruler;
    }

}