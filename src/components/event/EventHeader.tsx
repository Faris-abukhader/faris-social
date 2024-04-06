import Image from 'next/image'
import { memo, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { CheckCircle2, MailIcon, Star } from 'lucide-react'
import { type TGetTargetEvent, type TGetOneEvent } from '@faris/server/module/event/event.handler'
import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import ButtonSkeleton from '../skeleton/ButtonSekeleton'
import { useTranslation } from 'next-i18next';import Loading from '../general/Loading'
import InviteFriendModel, { useFriendInvitationModel } from '../general/invitation/InviteFriendModel'
import EventDateBox from './EventDateBox'
import { useToast } from '../ui/use-toast'

const EventHeader = ({ event }: { event: TGetOneEvent }) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const requesterId = useSessionStore(state => state.user.id)
  const [data, setData] = useState<TGetTargetEvent | undefined>()
  const { setOpen, show } = useFriendInvitationModel(state => state)
  const { data: targetEvent, isLoading } = api.event.getTarget.useQuery({ eventId: event?.id, requesterId }, { enabled: !!requesterId && !!event && !!event.id })
  const { mutate: changingProcedure, isLoading: isChangingLoading } = api.event.changingProcedure.useMutation({
    onSuccess(data) {
      toast({
        title: t(data.status == 'going' ? 'eventAddedToGoingList' : 'eventAddedToInterestedList')
      })
      setData((prevs) => {
        if (prevs) {
          return {
            ...prevs, status: data.status
          }
        }
      })
    },
  })
  const { mutate: interestingProcedure, isLoading: isInterestingProcedureLoading } = api.event.interestingProcedure.useMutation({
    onSuccess() {
      toast({
        title: t('eventAddedToInterestedList')
      })
      setData((prevs) => {
        if (prevs) {
          return {
            ...prevs, status: 'interested'
          }
        }
      })

    },
  })
  const { mutate: goingProcedure, isLoading: isGoingProcedureLoading } = api.event.goingProcedure.useMutation({
    onSuccess() {
      setData((prevs) => {
        toast({
          title: t('eventAddedToGoingList')
        })
        if (prevs) {
          return {
            ...prevs, status: 'going'
          }
        }
      })
    },
  })

  useEffect(() => {
    targetEvent && setData(targetEvent)
  }, [targetEvent])

  return (
    <div className='w-full'>
      <div className='relative w-full h-560 sm:h-80 md:h-96 rounded-b-md shadow-sm'>
        <Image src={event?.image?.url ?? '/image/placeholder.png'} width={1200} height={700} alt='cover_image' className='w-full h-560 sm:h-80 md:h-96 sm:rounded-b-md shadow-sm object-fill' />
        <EventDateBox date={new Date(event?.eventTime).getDate()} className=' scale-75 sm:scale-100  absolute bottom-3 left-3 sm:bottom-6 sm:left-6' />
      </div>
      <div className='flex-row sm:flex space-y-4 sm:space-y-0 items-center justify-between p-6 '>
        <div className='flex-row space-y-5 sm:space-y-0 sm:flex items-center gap-x-4'>
          <div className='sm:-mt-4'>
            <h1 className='font-bold text-2xl sm:text-lg py-4'>{event?.title}</h1>
            <p className='py-4 text-sm font-semibold text-orange-600'>{String(event?.eventTime)}</p>
          </div>
        </div>

        {isLoading ? <div className='flex items-center justify-end sm:justify-start gap-x-2'>{Array.from({ length: 3 }).map((_, i) => <ButtonSkeleton key={i} />)}</div>
          :
          <div className='flex items-center justify-end sm:justify-start gap-x-2'>
            {data && !data.isOnwer && data.status == 'none' &&
              <Button onClick={() => interestingProcedure({ eventId: event.id, userId: requesterId, isInteresting: true })} variant={'secondary'} className='w-full sm:w-fit gap-x-1 shadow-sm' >
                <Star className='w-3 h-3' />
                <span>{isInterestingProcedureLoading ? <Loading /> : t('interested')}</span>
              </Button>
            }
            {data && !data.isOnwer && data.status == 'none' &&
              <Button onClick={() => goingProcedure({ eventId: event.id, userId: requesterId, isGoing: true })} variant={'secondary'} className='w-full sm:w-fit gap-x-1 shadow-sm' >
                <CheckCircle2 className='w-3 h-3' />
                <span>{isGoingProcedureLoading ? <Loading /> : t('going')}</span>
              </Button>
            }
            {data && !data.isOnwer && data.status != 'none' && <Button onClick={() => changingProcedure({ eventId: event.id, userId: requesterId, changeTo: data.status == 'going' ? 'interested' : 'going' })} variant={'secondary'} className='w-full sm:w-fit gap-x-1'>
              <Star className='w-3 h-3' />
              <span>{isChangingLoading ? <Loading /> : data.status == 'going' ? t('changeToInterested') : t('changeToGoing')}</span>
            </Button >}
            <Button onClick={() => setOpen(event.id, 'event')} variant={'secondary'} className='w-full sm:w-fit gap-x-1 shadow-sm' >
              <MailIcon className='w-3 h-3' />
              <span>{t('invite')}</span>
            </Button>
          </div>
        }
      </div>
      {show && <InviteFriendModel />}
    </div>
  )
}

export default memo(EventHeader)