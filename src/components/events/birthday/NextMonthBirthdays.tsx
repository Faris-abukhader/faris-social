import { Card, CardContent, CardHeader } from '@faris/components/ui/card'
import { type GetTodaysFriends } from '@faris/server/module/birthday/birthday.handler'
import { api } from '@faris/utils/api'
import  { memo, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next';import useSessionStore from 'zustandStore/userSessionStore'
import IllustrationContainer from '@faris/components/general/IllustrationContainer'
import CurrentMonthBirthdaySkeleton from '@faris/components/skeleton/CurrentMonthBirthdaySkeleton'
import Link from 'next/link'
import CustomAvatar from '@faris/components/general/CustomAvatar'

const NextMonthBirthdays = () => {
    const { t } = useTranslation()
    const userId = useSessionStore(state => state.user.id)
    const { mutate, isLoading } = api.birthday.nextMonth.useMutation({
        onSuccess(data) {
            setData(data)
        },
    })
    const [data, setData] = useState<GetTodaysFriends | undefined>()

    useEffect(() => {
        userId && mutate({ userId, currentMonth: new Date().getMonth() })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])
    
    return (
        <Card className='w-full max-w-lg'>
            <CardHeader>{t(`${new Date().getMonth() + 2}`)}</CardHeader>
            <CardContent className=' space-y-2'>
                {isLoading ? <CurrentMonthBirthdaySkeleton />
                    :
                    data && data?.friends && data?.friends?.length > 0 ? <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-4">
                        {data?.friends.map(friend => <Link key={friend.user.id} href={`/profile/${friend.user.id}`}>
                            <CustomAvatar imageUrl={friend.user?.image?.url??undefined} alt={friend.user.fullName}/>
                        </Link>)}
                    </div>
                        :
                        <IllustrationContainer width={200} height={200} path='/illustrations/party.svg' description={t('noBirthdayIsInThisMonth')} />
                }
            </CardContent>
        </Card>
    )
}


export default memo(NextMonthBirthdays);

