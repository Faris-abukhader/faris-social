import { type TGetOneEvent } from '@faris/server/module/event/event.handler';
import { useTranslation } from "next-i18next";
import { Card } from '../ui/card';

export default function EventGuestWidget({ _count }: TGetOneEvent) {
  const {t} = useTranslation()
  return (
    <Card className='p-4 py-8 rounded-md w-full h-fit'>
      <h1 className='text-lg font-bold py-4'>{t('guests')}</h1>
      <div className='flex justify-around text-xs'>
        <div className='text-center'>
          <h1 className='text-lg font-bold'>{_count?.goingList}</h1>
          <p className='opacity-80'>{t('going')}</p>
        </div>
        <div className='text-center'>
          <h1 className='text-lg font-bold'>{_count?.interestedList}</h1>
          <p className='opacity-80'>{t('interested')}</p>
        </div>
      </div>
    </Card>
  );
}

