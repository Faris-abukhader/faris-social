import  { memo } from 'react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import LastPhotosSkeleton from '../../skeleton/LastPhotoSkeleton'
import ViewRender from '../../general/ViewRender'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { Card } from '@faris/components/ui/card';

interface LastPhotosProps {
  profileId: string
}
const LastPhotos = ({ profileId }: LastPhotosProps)=> {
  const { t } = useTranslation()

  const { data, isLoading } = api.profile.getOneProfilePhotoList.useQuery({ id: profileId, page: 0, range: PAGINATION.MINI },{cacheTime:60})// cache for one minute

  if (isLoading) return <LastPhotosSkeleton />

  return (
    <Card className='p-3'>
      <h1 className='text-md py-4 font-bold'>{t('photos')} {data && data.data && data.data._count.mediaList > 0 ? <span>{`(${data.data._count.mediaList})`}</span> : true}</h1>
      <ViewRender
        illustrations='photos'
        isGrid={true}
        isLoading={isLoading}
        data={data?.data.mediaList || []}
        skeletonComonent={<></>}
        noDataMessage={'noPhotoFoundForThisAccount'}
        hasNextPage={false}
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {data && data.data && data?.data?.mediaList?.map((media, i) => <div key={i} >
          <Image key={i} src={media?.url} width={300} height={300} className=' shadow-ms w-[300px] h-[300px] rounded-md' alt='profile_avatar' />
        </div>)}
        </div>
      </ViewRender>
    </Card>
  )
}

export default memo(LastPhotos)