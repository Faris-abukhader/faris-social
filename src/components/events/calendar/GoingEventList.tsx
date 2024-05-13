import { api } from '@faris/utils/api'
import { type EventType } from '../yourEvent/YourEvent'
import useSessionStore from 'zustandStore/userSessionStore'
import EventCardSkeleton from '@faris/components/skeleton/EventCardSkeleton'
import EventCard from '../EventCard'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { useEventListStore } from 'zustandStore/eventList'
import { useDataEffect } from '@faris/hooks/customDataLoader'
import ViewRender from '@faris/components/general/ViewRender'
import { useRef } from 'react'
import { useIsVisible } from '@faris/hooks/useIsVisable'

export default function GoingEventList({ eventType }: { eventType: EventType }) {
    const containerRef = useRef(null)
    const isVisable = useIsVisible(containerRef)
    const authorId = useSessionStore(state => state.user.id)
    const { currentPage,
        target,
        setEvents,
        loadEvents,
        eventList,
        pages,
        nextPage
    } = useEventListStore(state => state)
    const { data, isLoading } = api.event.oneUserGoingList.useQuery({ authorId, page: currentPage, range: PAGINATION.EVENTS, type: eventType },{enabled:!!authorId && authorId!=''&& isVisable})

    useDataEffect<string>({
        data,
        currentPage,
        condition: currentPage == 0 && eventList.length > 0 && target == 'goingList',
        target: target?? '',
        currentTarget: 'goingList',
        loadFunction: loadEvents,
        setFunction: setEvents
    })

    return <div ref={containerRef}>
        <ViewRender
        illustrations='events'
        isGrid={true}
        isLoading={isLoading}
        data={eventList || []}
        skeletonComonent={<EventCardSkeleton />}
        noDataMessage={'noEvent'}
        nextPage={nextPage}
        hasNextPage={pages - 1 > currentPage}
    >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-3'>
            {eventList && eventList.map(event => <EventCard status={'going'} isOwner={false} isEditable={true} key={event.id} {...event} />)}
        </div>
    </ViewRender>
    </div>
}
