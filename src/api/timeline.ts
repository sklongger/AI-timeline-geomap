import request from "@/utils/request.ts";
import { TimelineType } from "@/components/timeline/renderTimeline.ts";

export async function getTimeline(timelineType: TimelineType, data: Object): Promise<[]> {
    return request({
        url: `/geotime/${timelineType}`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}