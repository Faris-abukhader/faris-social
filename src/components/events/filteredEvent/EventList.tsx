import EventCardSkeleton from '@faris/components/skeleton/EventCardSkeleton'
import { api } from '@faris/utils/api'
import { useEventListStore } from 'zustandStore/eventList'
import useSessionStore from 'zustandStore/userSessionStore'
import EventCard from '../EventCard'
import ViewRender from '@faris/components/general/ViewRender'
import { useDataEffect } from '@faris/hooks/customDataLoader'
import { useTranslation } from "next-i18next"

export default function EventList({ category }: { category: string }) {
    const {t} = useTranslation()
    const requesterId = useSessionStore(state => state.user.id)
    const { currentPage,
        range,
        target,
        setEvents,
        loadEvents,
        eventList,
        pages,
        nextPage
    } = useEventListStore(state => state)
    const { data, isLoading } = api.event.oneCategory.useQuery({ category, requesterId, page: currentPage, range }, { enabled: !!requesterId })

    useDataEffect<string>({
        data,
        currentPage,
        condition: currentPage == 0 && eventList.length > 0 && target == category,
        target: target ?? '',
        currentTarget: category,
        loadFunction: loadEvents,
        setFunction: setEvents
    })
    
    return (
        <div className='w-full min-h-screen pt-10 pb-20'>
            <h1 className='text-lg font-semibold'>{t('events')+' '+t(category)}</h1>
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
                    {eventList.map(event => <EventCard isEditable={false} key={event.id} {...event} />)}
                </div>
            </ViewRender>
        </div>
    )
}
