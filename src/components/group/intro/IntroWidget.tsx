import React from 'react'
import { EditIcon, Eye, EyeOff, Globe2, Info, MapPin } from 'lucide-react'
import { useTranslation } from 'next-i18next';import { type TGetOneFullGroup } from '@faris/server/module/group/group.handler'
import { Card } from '../../ui/card'
import UpdateGroupIntroModel, { useGroupIntroModel } from './UpdateGroupModel'
import { Button } from '@faris/components/ui/button'
import useSessionStore from 'zustandStore/userSessionStore'

export default function IntroTab({ id,owner,title,rules,about, location, category, isVisiable, isPrivate }: TGetOneFullGroup) {
    const { t } = useTranslation()
    const userSessionId = useSessionStore(state=>state.user.id)
    const openGroupIntroModel = useGroupIntroModel(state=>state.setShow)

    return (
        <Card className='relative p-6 w-full'>
            {owner?.id == userSessionId && <Button onClick={() => openGroupIntroModel(true,{ id,title, about: about ?? '', location, category, rules, isPrivate, isVisiable })} variant={'secondary'} className='absolute top-2 right-2 rounded-full w-10 h-10 p-0'><EditIcon className='w-4 h-4' /></Button>}
            <h1 className='text-md font-bold'>{t('about')}</h1>
            <p className='text-xs opacity-90 py-4'>{about}</p>
            <ul className='space-y-5'>
                {category && <li className='flex items-center gap-x-1'>
                    <Info className='w-4 h-4' />
                    <span className='text-xs'><b className=' capitalize'>{t('category')}</b> {t(category)}</span>
                </li>}
                <li className=''>
                    <div className='flex items-center gap-x-1'>
                        <Globe2 className='w-4 h-4' />
                        <span className='text-xs'>{t(isPrivate ? 'private' : 'public')}</span>
                    </div>
                    <p className=' text-xs opacity-70'>{t(isPrivate ? 'privateNotice' : 'publicNotice')}</p>
                </li>
                <li className=''>
                    <div className='flex items-center gap-x-1'>
                        {isVisiable ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
                        <span className='text-xs'>{t(isVisiable ? 'visiable' : 'notVisiable')}</span>
                    </div>
                    <p className='text-xs opacity-70'>{t(isVisiable ? 'visiableNotice' : 'notVisiableNotice')}</p>
                </li>
                {location && <li className=''>
                    <div className='flex items-center gap-x-1'>
                        <MapPin className='w-4 h-4' />
                        <span className='text-xs'>{location}</span>
                    </div>
                </li>}
            </ul>
            {owner?.id == userSessionId && <UpdateGroupIntroModel />}
        </Card>
    )
}
