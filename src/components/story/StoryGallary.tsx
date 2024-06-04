import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useTranslation } from 'next-i18next';import { Button } from '../ui/button'
import StoryCard from './StoryCard'
import MiniStoryCard from './MiniStoryCard'
import { useStoryGallary } from 'zustandStore/storyGallaryStore'

export default function StoryGallary() {
  const { t } = useTranslation()
  const { show, setShow, hasNextProfile, hasPreviousProfile, nextProfile, previousProfile } = useStoryGallary()

  return (
    <div className={`z-100 backdrop-blur-sm  fixed ${show ? 'w-full h-[100svh]' : 'w-0 h-0 left-1/2 top-1/2'} max-h-[100svh] relative overflow-hidden bg-opacity-80 animate-in duration-700 ease-in-out flex items-start sm:items-center justify-center top-0 left-0 bg-black`}>
      <div className='w-full absolute left-0 top-2 flex items-center justify-between px-4'>
        <h1 className='text-lg font-bold'>{t('platformName')}</h1>
        <Button variant={'ghost'} className='rounded-full w-fit h-fit p-2' onClick={() => setShow(false)}>
          <X />
          <span className=' sr-only'>close story button</span>
          </Button>
      </div>
      <div className='w-full flex items-center justify-center p-0 gap-x-1'>
        <MiniStoryCard className='absolute top-0 -left-4' type='previous' />
        {hasPreviousProfile() && <Button variant={'secondary'} className='hidden sm:z-10 sm:block rounded-full w-fit h-fit p-2' onClick={previousProfile}><ChevronLeft /></Button>}
        <StoryCard />
        {hasNextProfile() && <Button variant={'secondary'} className='hidden sm:z-10 sm:block rounded-full w-fit h-fit p-2' onClick={nextProfile}><ChevronRight /></Button>}
        <MiniStoryCard className='absolute top-0 -right-4' type='next' />
      </div>
    </div>
  )
}