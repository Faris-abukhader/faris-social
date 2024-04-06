import { Button } from '@faris/components/ui/button'
import { Card, CardContent, CardFooter } from '@faris/components/ui/card'
import Image from 'next/image'
import { type GetOneEvent } from '@faris/server/module/event/event.handler'
import Link from 'next/link'
import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import { useTranslation } from 'next-i18next';import Loading from '../../general/Loading'
import { useEventListStore } from 'zustandStore/eventList'
import { useToast } from '@faris/components/ui/use-toast'

export default function DiscoveredEventCard({ id, title, eventTime, _count,image }: GetOneEvent) {
    const { t } = useTranslation()
    const {toast} = useToast()
    const userId = useSessionStore(state => state.user.id)
    const removeEvent = useEventListStore(state=>state.deleteEvent)
    const { mutate, isLoading } = api.event.interestingProcedure.useMutation({
        onSuccess() {
            removeEvent(id)
            toast({
                title:t('eventAddedToInterestedList')
              })
        }
    })

    return (
        <Card>
            <div className='w-full max-w-md h-44 overflow-hidden'>
                <Image src={image?.url??'/image/placeholder.png'} className='rounded-t-md  object-fill w-full h-full' width={400} height={800} alt='profile_image' />
            </div>
            <CardContent className='p-2 text-xs'>
                <p className=' opacity-70'>{eventTime.toUTCString()}</p>
                <Link href={`/event/${id}`} className='text-lg font-bold'>{title}</Link>
                <div className=' opacity-70'>{_count.interestedList} interested . {_count.goingList} going</div>
            </CardContent>
            <CardFooter className='px-2 py-4'>
                <Button variant={'secondary'} className='w-full' disabled={isLoading} onClick={() => mutate({ eventId: id, userId, isInteresting: true })}>{isLoading ? <Loading /> : t('interested')}</Button>
            </CardFooter>
        </Card>
    )
}
