import ViewRender from '@faris/components/general/ViewRender'
import { api } from '@faris/utils/api'
import { useSearchParams } from 'next/navigation'
import { useSearchingStore } from 'zustandStore/searchingStore'
import UserCardSkeleton from '@faris/components/skeleton/UserCardSkeleton'
import RecordCard from './RecordCard'
import { type TSearchingPage } from '@faris/server/module/search/search.handler'
import { useTranslation } from 'next-i18next';import { useSearchingDataLoader } from '@faris/hooks/searchingDataLoader'

export default function PagesTap() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const { dataList, setData, loadData, nextPage, currentPage, pages, range, type } = useSearchingStore(state => state);
  const { data, isLoading } = api.searching.page.useQuery({ query: String(query), page: currentPage, range }, { enabled: !!query })

  useSearchingDataLoader({
    data,
    currentPage,
    condition: dataList.length > 0 && type=='page',
    target: 'page',
    procedure:type ? (type=='page'?'load':'set'):'none',
    setFunction: setData,
    loadFunction:loadData
  })

  return <ViewRender
    illustrations='pages'
    isGrid={false}
    isLoading={isLoading}
    data={dataList}
    skeletonComonent={<UserCardSkeleton />}
    noDataMessage={'noResult'}
    nextPage={nextPage}
    hasNextPage={pages - 1 > currentPage}
  >
    {dataList.map((record: TSearchingPage, i) => <RecordCard target='page' key={i} id={record?.id} image={record?.profileImage}>
      <h1>{record.title}</h1>
      <h2 className='text-[10px]'>{t(record.category ?? '')} . {t('peopleLikePage', { number: record._count?.likeList })}</h2>
    </RecordCard>)}
  </ViewRender>
}