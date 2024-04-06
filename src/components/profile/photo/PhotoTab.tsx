import { memo, useState } from 'react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import ViewRender from '../../general/ViewRender'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { Card } from '@faris/components/ui/card';

interface PhotoTabProps {
  id: string
}

const PhotoTab = ({ id }: PhotoTabProps)=> {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const { data, isLoading } = api.profile.getOneProfilePhotoList.useQuery({ id, page: currentPage, range: PAGINATION.MINI },{enabled:!!id,cacheTime:60}) // cache for one minute
  return (
    <Card className='p-4'>
      <h1 className='py-4 text-xl font-bold'>{t('photos')}</h1>
      <ViewRender
        illustrations='photos'
        isGrid={true}
        isLoading={isLoading}
        data={data?.data.mediaList || []}
        skeletonComonent={<></>}
        noDataMessage={'noPhotoFoundForThisAccount'}
        nextPage={() => setCurrentPage(currentPage + 1)}
        hasNextPage={data && data.pageNumber > 0?true:false}        
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
          {data && data.data && data?.data?.mediaList?.map((media, i) => <div key={i} className='border rounded-md shadow-sm w-fit' >
          <Image key={i} src={media?.url} width={300} height={300} className=' shadow-ms w-[300px] h-[300px] rounded-md' alt='profile_avatar' />
        </div>)}
        </div>
      </ViewRender>
    </Card>
  )
}

export default memo(PhotoTab)