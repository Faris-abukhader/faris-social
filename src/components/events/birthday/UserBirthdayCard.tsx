import CustomAvatar from '@faris/components/general/CustomAvatar'
import { Card } from '@faris/components/ui/card'
import { type GetOneUserBirthday } from '@faris/server/module/birthday/birthday.handler'
import Link from 'next/link'
import { useTranslation } from 'next-i18next';
export default function UserBirthdayCard({id,fullName,image,birthday}:GetOneUserBirthday) {
    const {t} = useTranslation()
    return (
        <Card className='hover:bg-accent/60'>
            <Link href={`/profile/${id}`}>
            <div className='flex items-center justify-between px-3 py-2'>
                <div className='flex items-center gap-x-2'>
                    <CustomAvatar alt={fullName} imageUrl={image?.url}/>
                    <h1 className=' capitalize font-bold'>{fullName}</h1>
                </div>
                {birthday &&<h4 className='text-xs'>{new Date().getFullYear()-birthday.year} {t('yearsOld')}</h4>}
            </div>
          </Link>
        </Card>
    )
}
