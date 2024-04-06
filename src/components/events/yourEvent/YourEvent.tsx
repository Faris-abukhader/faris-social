import { api } from '@faris/utils/api'
import { memo, useState } from 'react'
import { useTranslation } from 'next-i18next';import { useEventListStore } from 'zustandStore/eventList'
import useSessionStore from 'zustandStore/userSessionStore'
import EventCardSkeleton from '../../skeleton/EventCardSkeleton'
import EventCard from '../EventCard'
import { useEventModel } from './CreateNewEventModel'
import { useDataEffect } from '@faris/hooks/customDataLoader'
import ViewRender from '@faris/components/general/ViewRender'
import { Button } from '@faris/components/ui/button'
import { Card } from '@faris/components/ui/card'
import { PAGINATION } from '@faris/server/module/common/common.schema'

export type EventType = 'all' | 'upcoming' | 'past'

const YourEvent = () => {
  const {t} = useTranslation()
  const authorId = useSessionStore(state => state.user.id)
  const setShow = useEventModel(state => state.setShow)
  const [eventType, setEventType] = useState<EventType>('all')

  const { currentPage,
    target,
    setEvents,
    loadEvents,
    eventList,
    pages,
    nextPage
  } = useEventListStore(state => state)
  const { data, isLoading } = api.event.getOneUser.useQuery({ authorId, page: currentPage, range:PAGINATION.EVENTS, type: eventType },{enabled:!!authorId})

  useDataEffect<string>({
    data,
    currentPage,
    condition: currentPage == 0 && eventList.length > 0 && target == 'yourEvent',
    target: target ?? '',
    currentTarget: 'yourEvent',
    loadFunction: loadEvents,
    setFunction: setEvents
  })

  return <div className='p-4 space-y-4 pb-10'>
    <section className='w-full lg:hidden flex items-center justify-end pb-4'>
      <Button onClick={() => setShow(true)} size={'sm'}>{t('createNewEvent')}</Button>
    </section>
    <Card className='p-4'>
      <h1 className='text-lg font-bold pb-6'>{t('youHostedEvent')}</h1>
      <div className='flex items-center gap-x-2'>
        <Button size={'sm'} variant={eventType == 'upcoming' ? 'default' : 'outline'} onClick={() => setEventType('upcoming')}>{t('upComing')}</Button>
        <Button size={'sm'} variant={eventType == 'past' ? 'default' : 'outline'} onClick={() => setEventType('past')}>{t('past')}</Button>
      </div>
    </Card>
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
        {eventList && eventList.map(event => <EventCard isEditable={true} key={event.id} {...event} />)}
      </div>
    </ViewRender>
  </div>

}
   
export default memo(YourEvent)