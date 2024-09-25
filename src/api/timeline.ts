import request from "@/utils/request.ts";

export async function getTimeline(): Promise<[]> {
    return request({
        url: '/geotime/technews',
        method: 'post'
    })
}