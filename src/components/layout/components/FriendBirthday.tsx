import IllustrationContainer from '@faris/components/general/IllustrationContainer'
import BirthdaySekeleton from '@faris/components/skeleton/BirthdaySekeleton'
import { Card, CardTitle } from '@faris/components/ui/card'
import { type GetTodaysFriends } from '@faris/server/module/birthday/birthday.handler'
import { api } from '@faris/utils/api'
import { Gift } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, memo } from 'react'
import { useTranslation } from 'next-i18next';
import useSessionStore from 'zustandStore/userSessionStore'
const FriendBirthday = () => {
  const { t } = useTranslation()
  const userId = useSessionStore(state => state.user?.id)
  const [data, setData] = useState<GetTodaysFriends | undefined>()
  const { mutate, isLoading } = api.birthday.today.useMutation({
    onSuccess(data) {
      setData(data)
    },
  })

  useEffect(() => {
    userId && mutate({ userId, currentDate: new Date() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return (
    <Card className='border p-4'>
      <CardTitle className='font-bold py-3'>{t('birthdays')}</CardTitle>
      {isLoading ? Array.from({ length: 6 }).map((_, index) => <BirthdaySekeleton key={index} />)
        :
        data && data.friends.length > 0 ? data.friends.map(friend => <div key={friend.user.id} className='flex items-end gap-x-2 text-xs space-y-4'>
          <Gift className='w-5 h-5' />
          <Link href={`/profile/${friend.user.id}`}><h1><b className='hover:text-blue-300 hover:dark:text-blue-900 transition-colors duration-500'>{friend.user.fullName}</b> {t('birthdayIsToday')}. </h1></Link>
        </div>)
          :
          <IllustrationContainer width={140} height={140} path='/illustrations/party.svg' description={t('noOneBirthdayisToday')} />
      }
    </Card>
  )
}

export default memo(FriendBirthday);
