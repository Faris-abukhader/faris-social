import { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next';import { api } from '@faris/utils/api'
import ViewRender from '@faris/components/general/ViewRender'
import { PAGINATION } from '@faris/server/module/common/common.schema'
import { Card } from '@faris/components/ui/card'

export const PhotoCardSkeleton = () => {
    return (
        <div className='w-full rounded-sm h-28 animate-pulse skeleton-background'></div>
    )
}

interface PhotoTabProps {
    pageId: string
}
export default function PhotoTab({ pageId }: PhotoTabProps) {
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(0)
    const { data, isLoading } = api.page.getPhotoList.useQuery({ id: pageId, page: currentPage, range: PAGINATION.PHOTOS }, { enabled: !!pageId })
    return (
        <Card className='p-4'>
            <h1 className='py-4 text-xl font-bold'>{t('Photos')}</h1>
            <ViewRender
                illustrations='pages'
                isGrid={true}
                isLoading={isLoading}
                data={data?.data?.mediaList ?? []}
                skeletonComonent={<PhotoCardSkeleton />}
                noDataMessage={'noPhotoFoundForThisPage'}
                nextPage={() => setCurrentPage(currentPage + 1)}
                hasNextPage={(data && currentPage + 1 < data.pageNumber) ? true : false}
            >
                <div className='space-y-2 py-5'>
                    {data && data.data && data.data.mediaList.map((media, index) => <Image key={index} src={media.url} width={300} height={300} className=' shadow-ms w-[300px] h-[300px] rounded-md' alt='page_photo' />)}
                </div>
            </ViewRender>
        </Card>
    )
}
