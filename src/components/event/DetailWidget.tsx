import { Layers, Navigation, User, Users, Webcam } from 'lucide-react'
import Link from 'next/link'
import { type TGetOneEvent } from '@faris/server/module/event/event.handler'
import { useTranslation } from 'next-i18next';import { Card } from '../ui/card'

export default function DetailsTab({ _count,author,type,description,category }: TGetOneEvent) {
  const { t } = useTranslation()
  return (
    <Card className='p-6 w-full rounded-md'>
      <h1 className='text-md font-bold'>{t('details')}</h1>
      <ul className='space-y-5 py-5'>
        <li className='flex items-center gap-x-1'>
          <Users className='w-4 h-4' />
          <span>{t('peopoleResponded', { number: `${+_count?.goingList + _count?.interestedList}` })}</span>
        </li>
        <li className='flex items-center gap-x-1'>
          <User className='w-4 h-4' />
          <Link className=' font-bold hover:animate-in hover:slide-in-from-right-3 ease-in-out' href={`/profile/${author?.id}`}>
            {author?.fullName}
          </Link>
        </li>
        <li className='flex items-center gap-x-1'>
          <Layers className='w-4 h-4' />
          <Link className='hover:text-blue-500 hover:dark:text-blue-800 duration-500 transition-colors' href={`/events/filter/${category}`}>{t(category)}</Link>
        </li>
        <li className='flex items-center gap-x-1'>
          { type == 'inPerson ' ? <Navigation className="w-4 h-4" /> : <Webcam className="w-4 h-4" />}
          <span >{t(type)}</span>
        </li>
      </ul>
      <p className='text-xs opacity-80'>{description}</p>
    </Card>
  );
}