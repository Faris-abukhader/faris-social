import Link from 'next/link'
import { type TGetOnePage } from '@faris/server/module/page/page.handler'
import { ThumbsUp } from 'lucide-react'
import { useTranslation } from 'next-i18next';import CustomAvatar from '../general/CustomAvatar'
import { Card } from '../ui/card'

export default function PageCard({ id, profileImage, title, _count }: TGetOnePage) {
  const { t } = useTranslation()
  return (
    <Card className='p-4 rounded-md shadow-sm hover:border-2 transition-all ease-in duration-100'>
      <Link href={`/page/${id}`} className='flex gap-x-2 hover:cursor-pointer hover:opacity-80'>
        <CustomAvatar imageUrl={profileImage?.url} alt={`page_profile`} />
        <div>
          <h1 className=' font-bold'>{title}</h1>
          <div className='flex gap-x-3 text-xs opacity-80'>
            <div className='flex items-center gap-x-1'> <ThumbsUp className='w-3 h-3' /> <span>{t('peopleLikePage', { number: _count.likeList })}</span></div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
