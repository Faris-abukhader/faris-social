import  { memo } from 'react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next';import IllustrationContainer from '../../general/IllustrationContainer'
import { Card } from '@faris/components/ui/card'

type Photo ={
  url:string
}

interface LastPhotosProps {
  mediaList:Photo[]
  _count:{
    mediaList:number
  }
}

const LastPhotos =({mediaList,_count}:LastPhotosProps)=> {
  const {t} = useTranslation()
  return (
    <Card className='p-3'>
    <h1 className='text-md py-4 font-bold'>{t('photos')} <span>{`(${_count?.mediaList})`}</span></h1>
        {mediaList && mediaList.length > 0 ? <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>{mediaList.map((media, i) =><Image key={i} src={media.url} width={300} height={300} className=' shadow-ms w-[300px] h-[300px] rounded-md' alt='profile_avatar' />)}</div>
        :
        <IllustrationContainer width={180} height={180} path='/illustrations/photos.svg' description={t('noPhotoFoundForThisPage')}/>
        }
  </Card>
  )
}

export default memo(LastPhotos)
