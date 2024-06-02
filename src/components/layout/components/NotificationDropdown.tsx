import CustomAvatar from '@faris/components/general/CustomAvatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from '@faris/components/ui/dropdown-menu'
import { ScrollArea } from '@faris/components/ui/scroll-area'
import { Bell } from 'lucide-react'
import { Button } from '@faris/components/ui/button'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import useSessionStore from 'zustandStore/userSessionStore'
import { memo, useEffect } from 'react'
import ViewRender from '@faris/components/general/ViewRender'
import NotificationSkeleton from '@faris/components/skeleton/NotificationSkeleton'
import Link from 'next/link'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { pusherClient } from '@faris/utils/pusherClient'
import { toPusherKey } from '@faris/utils/pusherUtils'
import { Events } from '@faris/server/module/event/event.schema'
import { type TGetOneNotification } from '@faris/server/module/notification/notification.handler'
import { create } from 'zustand'

const NotificationDropdown = () => {
    const { t } = useTranslation()
    const userId = useSessionStore(state => state.user.id)
    const {data:notificationList,setData,addRecord} = useNotificationStore()
    const { data, isLoading } = api.notification.oneUserNotificationList.useQuery({ userId, range: PAGINATION.MINI, page: 0 }, { enabled: !!userId && notificationList.length==0, cacheTime: 60 }) // cache for one minute

    const newNotificationHandler = (notification: TGetOneNotification) => addRecord(notification)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{if(data && data.data)setData(data?.data)},[data])

    useEffect(() => {

        if (userId == undefined) return;

        pusherClient.subscribe(toPusherKey(`notification:${userId}`))
        pusherClient.bind(Events.COMING_NOTIFICATION, newNotificationHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`notification:${userId}`))
            pusherClient.unbind(Events.COMING_NOTIFICATION, newNotificationHandler)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    console.log(notificationList)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <>
                <Button  variant={'ghost'} className='px-2 relative'>
                    {<span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>}
                    <Bell className='w-5 h-5' />
                    <span className="sr-only mx-auto">notification dropdown button</span>
                </Button>
                <span className="sr-only mx-auto">notification dropdown button</span>
                </>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
                <DropdownMenuLabel className='flex items-center justify-between'>
                    {t('notification')}
                    <Button variant={'ghost'} className='w-fit h-fit p-1'><Link href={`/notification`}>{t('seeMore')}</Link></Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <ScrollArea className='h-80'>
                        <ViewRender
                            illustrations='posts'
                            isGrid={false}
                            isLoading={isLoading}
                            data={notificationList || []}
                            skeletonComonent={<NotificationSkeleton />}
                            noDataMessage={'noNotification'}
                            hasNextPage={false}
                        >
                            <div className='py-3'>
                                {notificationList && notificationList.length>0 && notificationList.sort((a,b)=> new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()).map((notification, i) => <DropdownMenuItem key={i} className='gap-x-2 hover:cursor-pointer'>
                                    <CustomAvatar imageUrl={notification?.sender?.image?.url ?? ''} alt={notification?.sender?.fullName} />
                                    <Link href={notification.link??'#'}>
                                    <div>
                                        <h1 className='text-sm font-bold'>{notification?.sender?.fullName}</h1>
                                        <p className='text-xs opacity-80'>{t(notification.content??'',{param1:notification.sender.fullName.split(' ')[0],param2:notification.id})}</p>
                                    </div>
                                    </Link>
                                </DropdownMenuItem>
                                )}
                            </div>
                        </ViewRender>
                    </ScrollArea>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export type NotificationStore = {
    data:TGetOneNotification[]|[],
    setData:(data:TGetOneNotification[]|[])=>void
    addRecord:(newNotification:TGetOneNotification)=>void
}

export const useNotificationStore = create<NotificationStore>((set,get)=>({
    data:[],
    setData(data){
        set({data})
    },
    addRecord(newNotification) {
        let temp = get().data
        if(temp){
            temp = [newNotification,...temp]
            if(temp.length>=PAGINATION.MINI){
                temp.pop()
            }
            set({data:temp})
        }
    },
}))

export default memo(NotificationDropdown);