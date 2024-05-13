import { type GetOneEvent } from '@faris/server/module/event/event.handler'
import Image from 'next/image'
import { memo } from 'react'
import { Card } from '../ui/card'
import { useTranslation } from 'next-i18next';import Link from 'next/link'
import { Button } from '../ui/button'
import { DeleteIcon, EditIcon, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import DeleteEventDialog, { useDeleteEventDialog } from './yourEvent/DeleteEventDialog'
import { UpdateEventModel, useUpdateEventModel } from './yourEvent/UpdateEventMode'
import { api } from '@faris/utils/api'
import Loading from '../general/Loading'
import useSessionStore from 'zustandStore/userSessionStore'
import { useToast } from '../ui/use-toast'
import { useEventListStore } from 'zustandStore/eventList';

interface EventCardProps extends GetOneEvent {
  isEditable?: boolean
  isOwner?: boolean
  status?: 'going' | 'interested' | 'none'
}
const EventCard = ({ image, id, title, eventTime, _count, category, description, type, isEditable = false, isOwner = true, status = 'none' }: EventCardProps) => {
  const { t } = useTranslation()
  const {toast} = useToast()
  const userId = useSessionStore(state=>state.user.id)
  const { setShow:setOpen, show:open } = useDeleteEventDialog(state => state)
  const { show, setShow } = useUpdateEventModel(state=>state)
  const { mutate, isLoading } = api.event.changingProcedure.useMutation({
    onSuccess(data) {
      removeEvent(data.eventId)
    },
  })
  const removeEvent = useEventListStore(state=>state.deleteEvent)
  const {mutate:removeFromCalendar,isLoading:isRemoveLoading} = api.event.removeFromCalendar.useMutation({
    onSuccess(data) {
      removeEvent(data.eventId)
      toast({
        title:t('removeEventFromCalenderSuccess')
      })
    },
  })

  return (
    <Card className='hover:border-blue-200 hover:dark:border-blue-950'>
      <div className='w-full h-fit relative'>
        <Image src={image?.url ?? '/image/placeholder.png'} width={500} height={320} alt='event_img' className='rounded-t-md w-full  h-80 mx-auto' />
        {(isLoading || isRemoveLoading) ? <div className='absolute top-2 right-2'><Loading/></div>
          :
          <>
            {isEditable && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={'sm'} variant={'outline'} className=' absolute top-2 right-2'>
                  <MoreHorizontal className=' w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`${isOwner ?'w-32':'w-48'}`}>
                {isOwner && <> <DropdownMenuItem className='hover:cursor-pointer gap-x-1' onClick={() => { setShow(true,{ image:image??{url:'',path:'',thumbnailUrl:''}, id, type:type as "inPerson" | "virtual" | "none", title, category, description, eventTime }); }}>
                  <EditIcon className='w-4 h-4' />
                  <span>{t('edit')}</span>
                </DropdownMenuItem>
                  <DropdownMenuItem className='hover:cursor-pointer gap-x-1' onClick={() => { setOpen(true,id) }}>
                    <DeleteIcon className='w-4 h-4' />
                    <span>{t('delete')}</span>
                  </DropdownMenuItem>
                </>}
                {!isOwner && status != 'none' && <DropdownMenuItem className='hover:cursor-pointer gap-x-1' onClick={() => mutate({eventId:id,userId,changeTo:status=='going'?'interested':'going'})}>
                  <EditIcon className='w-4 h-4' />
                  <span>{status == 'going' ? t('changeToInterested') : t('changeToGoing')}</span>
                </DropdownMenuItem>
                }
                {!isOwner && <DropdownMenuItem className='hover:cursor-pointer gap-x-1' onClick={() => removeFromCalendar({eventId:id,userId})}>
                  <DeleteIcon className='w-4 h-4' />
                  <span>{t('removeFromCalendar')}</span>
                </DropdownMenuItem>
                }
              </DropdownMenuContent>
            </DropdownMenu>}
          </>
        }
      </div>
      <hr />
      <Link href={`/event/${id}`}>
        <section className='p-4 space-y-2'>
          <h4 className='text-xs opacity-60'>{eventTime.toUTCString()}</h4>
          <h1 className='font-bold hover:text-blue-500 hover:dark:text-blue-800 duration-500 transition-colors'>{title}</h1>
          <div className='flex items-center gap-x-2 text-xs opacity-75'>
            <span><b>{_count.goingList}</b> {t('going')}</span>
            <span><b>{_count.interestedList}</b> {t('maybe')}</span>
          </div>
        </section>
      </Link>
      {isEditable && open && <DeleteEventDialog />}
      {isEditable && show && <UpdateEventModel />}
    </Card>
  )
}

export default memo(EventCard)
