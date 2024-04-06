import  { memo } from 'react'
import { Heart, Home, MapPin } from 'lucide-react'
import { useTranslation } from 'next-i18next';import { Card } from '../ui/card'

interface IntroTabProps {
    bio: string | null,
    livingLocation: string | null
    fromLocation: string | null
    status: string | null

}
const IntroTab = ({ bio, livingLocation, fromLocation, status }: IntroTabProps)=> {
    const { t } = useTranslation()
    return (
        <Card className='p-6 w-full'>
            <h1 className='text-md py-4 font-bold'>{t('intro')}</h1>
            {bio && <p className=' py-4 text-xs'>{bio}</p>}
            <ul className='space-y-5'>
                {livingLocation && <li className='flex items-center gap-x-1'>
                    <Home className='w-4 h-4' />
                    <span className='text-xs'>Lives in <b>{livingLocation}</b></span>
                </li>}
                {fromLocation && <li className='flex items-center gap-x-1'>
                    <MapPin className='w-4 h-4' />
                    <span className='text-xs'>from <b>{fromLocation}</b></span>
                </li>}
                {status && <li className='flex items-center gap-x-1'>
                    <Heart className='w-4 h-4' />
                    <span className='text-xs'>Status is <b>{status}</b></span>
                </li>}
            </ul>
        </Card>
    )
}

export default memo(IntroTab)