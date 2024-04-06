import  { memo, useState } from 'react'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import ViewRender from '../../general/ViewRender'
import CheckInCard from './CheckInCard'
import { CheckInCardSkeleton } from '../../skeleton/CheckInCardSkeleton'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { Card } from '@faris/components/ui/card';

interface CheckInTabProps {
    id: string
}

const CheckInTab = ({ id }: CheckInTabProps)=> {
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(0)
    const { data, isLoading } = api.profile.getOneProfileCheckInList.useQuery({ id, page: currentPage, range: PAGINATION.CHECKINS }, { enabled: !!id,cacheTime:60 })// cache for one minute
    return (
        <Card className='p-4'>
            <h1 className='py-4 text-xl font-bold'>{t('checkIns')}</h1>
            <ViewRender
                illustrations='checkIn'
                isGrid={true}
                isLoading={isLoading}
                data={data?.data || []}
                skeletonComonent={<CheckInCardSkeleton />}
                noDataMessage={'noCheckInFoundForThisAccount'}
                nextPage={() => setCurrentPage(currentPage + 1)}
                hasNextPage={data && data.pageNumber > 0?true:false}        
            >
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {data?.data.map((checkIn, i) => <CheckInCard key={i} {...checkIn} />)}
                </div>
            </ViewRender>
        </Card>
    )
}

export default memo(CheckInTab)