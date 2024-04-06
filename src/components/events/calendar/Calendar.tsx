import { useState } from 'react'
import { Button } from '@faris/components/ui/button'
import { type EventType } from '../yourEvent/YourEvent'
import { useTranslation } from 'next-i18next';
import { Card } from '../../ui/card'
import InterestedEventList from './InterestedEventList'
import GoingEventList from './GoingEventList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@faris/components/ui/tabs'

export default function Calendar() {
  const { t } = useTranslation()
  const [eventType, setEventType] = useState<EventType>('all')

  return (
    <div className='p-4 space-y-4'>
      <Card className='p-4'>
        <h1 className='text-lg font-bold'>{t('calendar')}</h1>
        <p className='pb-6 text-xs opacity-70'>{t('calendarNotice')}</p>
        <div className='flex items-center gap-x-2'>
          <Button size={'sm'} variant={eventType == 'upcoming' ? 'default' : 'outline'} onClick={() => setEventType('upcoming')}>{t('upComing')}</Button>
          <Button size={'sm'} variant={eventType == 'past' ? 'default' : 'outline'} onClick={() => setEventType('past')}>{t('past')}</Button>
        </div>
      </Card>
      <Tabs defaultValue="going" className="w-[400px]-- w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="going">{t('going')}</TabsTrigger>
          <TabsTrigger value="interested">{t('interested')}</TabsTrigger>
        </TabsList>
        <TabsContent value="going">
          <GoingEventList eventType={eventType} />
        </TabsContent>
        <TabsContent value="interested">
          <InterestedEventList eventType={eventType} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
