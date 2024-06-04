import { type TGetOneNotification } from '@faris/server/module/notification/notification.handler'
import Link from 'next/link'
import CustomAvatar from '../general/CustomAvatar'
import { ChevronRight } from 'lucide-react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

interface NotificationCardProps extends TGetOneNotification{
    isLast:boolean
}
const NotificationCard = ({link,sender,content,isLast}:NotificationCardProps) => {
    const {t} = useTranslation()
    return (
        <Link aria-disabled={link?true:false} href={link??''} className={`group flex items-center justify-between p-3 ${isLast?'border-b':''} hover:bg-accent`}>
            <div className='w-full flex items-center gap-x-2'>
            <CustomAvatar imageUrl={sender?.image?.url??''} alt={sender?.fullName}/>
            <div>
                <Link href={`/profile/${sender?.id}`} className='text-sm font-bold hover:text-blue-500 hover:dark:text-blue-800 duration-500 transition-colors'>{sender?.fullName}</Link>
                <p className='text-xs opacity-80'>{t(content,{param1:sender.fullName})}</p>
            </div>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-0 transition-opacity duration-500 ${link?'group-hover:opacity-100':''}`}/>
        </Link>
    )
}

export default memo(NotificationCard)
