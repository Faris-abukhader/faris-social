import { api } from '@faris/utils/api'
import ViewRender from '@faris/components/general/ViewRender'
import UserCardSkeleton from '@faris/components/skeleton/UserCardSkeleton'
import { useSearchingStore } from 'zustandStore/searchingStore'
import { useSearchParams } from 'next/navigation'
import { type TSearchingUser } from '@faris/server/module/search/search.handler'
import RecordCard from './RecordCard'
import { useSearchingDataLoader } from '@faris/hooks/searchingDataLoader'

export default function PeopleTap() {
    const searchParams = useSearchParams()
    const query = searchParams.get('query')
    const { dataList, setData, loadData, nextPage, currentPage, pages, range, type } = useSearchingStore(state => state);
    const { data, isLoading } = api.searching.user.useQuery({ query: String(query), page: currentPage, range }, { enabled: !!query }) 

    useSearchingDataLoader({
        data,
        currentPage,
        condition:dataList.length > 0 && type=='user',
        target:'user',
        procedure:type=='user'?'load':'set',
        setFunction:setData,
        loadFunction:loadData
    })

    return <ViewRender
        illustrations='friends'
        isGrid={false}
        isLoading={isLoading}
        data={dataList}
        skeletonComonent={<UserCardSkeleton />}
        noDataMessage={'noResult'}
        nextPage={nextPage}
        hasNextPage={pages - 1 > currentPage}
    >
        {dataList.map((record: TSearchingUser, i) => <RecordCard target='profile' key={i} id={record?.id} image={record?.image}>
            <h1>{record.fullName}</h1>
            <p className='text-[10px] opacity-60 line-clamp-1'>{record.bio}</p>
        </RecordCard>)}
    </ViewRender>
}
