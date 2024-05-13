import UserBirthdayCardSkeleton from '@faris/components/skeleton/UserBirthdayCardSkeleton'
import { Card, CardHeader } from '@faris/components/ui/card'
import { type  GetTodaysFriends } from '@faris/server/module/birthday/birthday.handler'
import { api } from '@faris/utils/api'
import  { memo, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next';
import useSessionStore from 'zustandStore/userSessionStore'
import UserBirthdayCard from './UserBirthdayCard'
import ViewRender from '@faris/components/general/ViewRender'

const TodayBirthdays = () => {
  const { t } = useTranslation()
  const userId = useSessionStore(state => state.user.id)
  const { mutate, isLoading } = api.birthday.today.useMutation({
    onSuccess(data) {
      setData(data)
    },
  })
  const [data,setData] = useState<GetTodaysFriends|undefined>()

  useEffect(() => {
    userId && mutate({ userId, currentDate: new Date() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])
  return (
    <Card className='w-full max-w-lg px-4'>
      <CardHeader>{t('todaysBirthday')}</CardHeader>
      <ViewRender
          illustrations='party'
          isGrid={false}
          isLoading={isLoading || !userId}
          data={data?.friends || []}
          skeletonComonent={<UserBirthdayCardSkeleton/>}
          noDataMessage={'noOneBirthdayisToday'}
          hasNextPage={false}
        >
          <div className='py-3'>
          {data && data?.friends.length > 0 && data.friends.map(friend=><UserBirthdayCard key={friend.user.id} {...friend.user}/>)}
          </div>
        </ViewRender>
    </Card>
  )
}

export default memo(TodayBirthdays);

