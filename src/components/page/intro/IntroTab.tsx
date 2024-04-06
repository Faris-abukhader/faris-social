import { BadgeInfo, Banknote, EditIcon, Globe2, Info, Mail, MapPin, Star } from 'lucide-react'
import { useTranslation } from 'next-i18next';import { type TGetOneFullPage } from '@faris/server/module/page/page.handler'
import Link from 'next/link'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import UpdateIntroModel, { useIntroModel } from './UpdateIntroModel'
import useSessionStore from 'zustandStore/userSessionStore'

export default function IntroTab({ id,owner, about, email, website_url, services, serviceArea, priceRange, category, averageRate, _count }: TGetOneFullPage) {
    const { t } = useTranslation()
    const showUpdateModel = useIntroModel(state => state.setShow)
    const userSessionId = useSessionStore(state=>state.user.id)
    return (
        <Card className='relative p-6 w-full rounded-md'>
            {owner.id == userSessionId && <Button onClick={() => showUpdateModel(true,{ pageId: id, about: about ?? '', services, serviceArea: serviceArea ?? undefined, priceRange: priceRange ?? undefined, website_url: website_url ?? undefined, email: email ?? undefined })} variant={'secondary'} className='absolute top-2 right-2 rounded-full w-10 h-10 p-0'><EditIcon className='w-4 h-4' /></Button>}
            <h1 className='text-md py-4 font-bold'>{t('intro')}</h1>
            <p className='py-4 mb-3 text-xs border-b'>{about}</p>
            <ul className='space-y-5'>
                <li className='flex items-center gap-x-1'>
                    <Info className='w-4 h-4' />
                    <span className='text-xs'><b className=' capitalize'>{t('page')}</b> {t(category as string)}</span>
                </li>
                {serviceArea && <li className='flex items-center gap-x-1'>
                    <MapPin className='w-4 h-4' />
                    <span className='text-xs'>{serviceArea}</span>
                </li>}
                {email && <li className='flex items-center gap-x-1'>
                    <Mail className='w-4 h-4' />
                    <span className='text-xs'>{email}</span>
                </li>}
                {website_url && <li className='flex items-center gap-x-1'>
                    <Globe2 className='w-4 h-4' />
                    <Link href={website_url} className='text-xs underline hover:text-blue-400'>{website_url}</Link>
                </li>}
                {services && services.length > 0 && <li className='flex items-center gap-x-1'>
                    <div>
                        <BadgeInfo className='w-4 h-4' />
                    </div>
                    <span className='text-xs'><b>{t('services')}</b> : {services.join(' , ')}</span>
                </li>}
                {priceRange && <li className='flex items-center gap-x-1'>
                    <Banknote className='w-4 h-4' />
                    <span className='text-xs'>{`${priceRange.from} ${priceRange.currency} ~ ${priceRange.to} ${priceRange.currency}`}</span>
                </li>}
                <li className='flex items-center gap-x-1'>
                    <Star className='w-4 h-4' />
                    <span className='text-xs'>{t('rates&reviews', { rate: averageRate, reviews: _count.reviewList })}</span>
                </li>
            </ul>
            {owner.id == userSessionId && <UpdateIntroModel />}
        </Card>
    )
}
