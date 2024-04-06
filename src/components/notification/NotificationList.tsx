import  { memo, useEffect, useState } from 'react'
import NotificationCard from './NotificationCard'
import { Card } from '../ui/card'
import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import { type TGetOneNotification } from '@faris/server/module/notification/notification.handler'
import ViewRender from '../general/ViewRender'
import NotificationSkeleton from '../skeleton/NotificationSkeleton'
import { PAGINATION } from '@faris/server/module/common/common.schema'

const NotificationList = () => {
  const userId = useSessionStore(state=>state.user.id)
  const [notifications,setNotifications] = useState<TGetOneNotification[]>([])
  const [currentPage,setCurrentPage] = useState(1)
  const {data,isLoading} = api.notification.oneUserNotificationList.useQuery({userId,page:currentPage,range:PAGINATION.NOTIFICATIONS},{enabled:!!userId,cacheTime:60}) // cache for one minute

  useEffect(()=>{
    if ((data==undefined || !data.data) || currentPage === 0 &&  notifications && notifications?.length>0) return;
    
    setNotifications((prevs) => prevs?.length >0 ?[...prevs,...data.data]:[...data.data])
       
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data])

  return (
    <Card className='mt-4 mb-20 rounded-sm'>
    <ViewRender
          illustrations='notification'
          isGrid={false}
          isLoading={isLoading}
          data={notifications}
          skeletonComonent={<NotificationSkeleton/>}
          noDataMessage={'noNotification'}
          nextPage={()=>setCurrentPage(currentPage+1)}
          hasNextPage={data && data.pageNumber > currentPage ? true:false}
        >
          <div>
            {notifications && notifications.length>0 && notifications.map((notification,index)=><NotificationCard isLast={notifications.length!=index+1} key={index} {...notification}/>)}
          </div>
        </ViewRender>
    </Card>
  )
}
export default memo(NotificationList)