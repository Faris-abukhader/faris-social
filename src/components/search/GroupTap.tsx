import { useSearchParams } from 'next/navigation'
import { useSearchingStore } from 'zustandStore/searchingStore'
import { api } from '@faris/utils/api'
import ViewRender from '@faris/components/general/ViewRender'
import UserCardSkeleton from '@faris/components/skeleton/UserCardSkeleton'
import { type TSearchingGroup } from '@faris/server/module/search/search.handler'
import RecordCard from './RecordCard'
import { useTranslation } from 'next-i18next';import { useSearchingDataLoader } from '@faris/hooks/searchingDataLoader'
export default function GroupsTap() {
  const {t} = useTranslation()
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const { dataList, setData, loadData, nextPage, currentPage, pages, range, type } = useSearchingStore(state => state);
  const { data, isLoading } = api.searching.group.useQuery({ query: String(query), page: currentPage, range }, { enabled: !!query, cacheTime: 60 }) // cache the result for one minute

  useSearchingDataLoader({
    data,
    currentPage,
    condition: dataList.length > 0 && type=='group',
    target: 'group',
    procedure:type ? (type=='group'?'load':'set'):'none',
    setFunction: setData,
    loadFunction:loadData
  })

  return <ViewRender
    illustrations='groups'
    isGrid={false}
    isLoading={isLoading}
    data={dataList}
    skeletonComonent={<UserCardSkeleton />}
    noDataMessage={'noResult'}
    nextPage={nextPage}
    hasNextPage={pages - 1 > currentPage}
  >
    {dataList.map((record: TSearchingGroup, i) => <RecordCard target='page' key={i} id={record?.id} image={record?.profileImage}>
      <h1>{record?.title}</h1>
      <h2 className='text-xs'>{record?.isPrivate ? t('private') : t('public')} {record?._count?.groupMember}</h2>
      <p className='text-xs opacity-60'>{t(record.category)}</p>    
      </RecordCard>)}
  </ViewRender>
}
