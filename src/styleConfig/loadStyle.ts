
import { TimelineType } from '@/components/timeline/renderTimeline.ts';

import { Store } from 'vuex'


export async function loadStyle(appName: string, store: Store<any>) {

    let timelineStyleConfig;
    let earthStyleConfig;
    let cardStyleConfig;
    let isMobile;


    if (appName == TimelineType.HISTORYGEOMAP) {
        ({ timelineStyleConfig, earthStyleConfig, cardStyleConfig, isMobile } = await import(`@/../config/historyGeoMapStyleConfig.ts`))
    } else if (appName == TimelineType.TECHNEWS) {
        ({ timelineStyleConfig, earthStyleConfig, cardStyleConfig, isMobile } = await import(`@/../config/techNewsStyleConfig.ts`))
    }

    store.commit('style/updateStyle', {
        timelineStyleConfig,
        earthStyleConfig,
        cardStyleConfig,
        isMobile
    })
};