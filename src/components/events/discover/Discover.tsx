import { Card, CardContent, CardHeader } from '../../ui/card'
import { Button } from '../../ui/button'
import { useTranslation } from 'next-i18next';import { useEventModel } from '../yourEvent/CreateNewEventModel'
import DiscoveredEventCard from './DiscoveredEventCard'
import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import DiscoverEventCardSkeleton from '../../skeleton/DiscoverEventCardSkeleton'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { useEventListStore } from 'zustandStore/eventList'
import { useDataEffect } from '@faris/hooks/customDataLoader'
import ViewRender from '@faris/components/general/ViewRender'

export default function DiscoverEvents() {
  const { t } = useTranslation()
  const setShow = useEventModel(state => state.setShow)
  const requesterId = useSessionStore(state => state.user.id)
  const { currentPage,
    target,
    setEvents,
    loadEvents,
    eventList,
    pages,
    nextPage
  } = useEventListStore(state => state)
  const { data, isLoading } = api.event.getRecommendedList.useQuery({ requesterId, range: PAGINATION.EVENTS, page: currentPage }, { enabled: !!requesterId })

  useDataEffect<string>({
    data,
    currentPage,
    condition: currentPage == 0 && eventList.length > 0 && target == 'discover',
    target: target ?? '',
    currentTarget: 'discover',
    loadFunction: loadEvents,
    setFunction: setEvents
  })

  return (
    <div className='pt-6 pb-20 space-y-4'>
      <Button className='lg:hidden' onClick={() => setShow(true)} size={'sm'}>{t('createNewEvent')}</Button>
      <Card className='w-full'>
        <CardHeader className='text-lg font-bold'>{t('discoverEvent')}</CardHeader>
        <CardContent className='w-full'>
          <ViewRender
            illustrations='events'
            isGrid={true}
            isLoading={isLoading}
            data={eventList || []}
            skeletonComonent={<DiscoverEventCardSkeleton />}
            noDataMessage={'noEvent'}
            nextPage={nextPage}
            hasNextPage={pages - 1 > currentPage}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-3'>
              {eventList.map(event => <DiscoveredEventCard key={event.id} {...event} />)}
            </div>
          </ViewRender>
        </CardContent>
      </Card>
    </div>
  )
}
