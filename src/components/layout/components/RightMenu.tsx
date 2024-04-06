import  { memo } from 'react'
import FriendBirthday from './FriendBirthday'
import { ScrollArea } from '@faris/components/ui/scroll-area'
import TrendForYou from './TrendForYou'

const RightMenu = () => {
  return (
    <div className='hidden md:block w-full lg:w-1/3 max-w-[320px] border-l px-3 max-h-screen'>
      <ScrollArea className='h-screen  space-y-4'>
      <FriendBirthday/>
      <TrendForYou/>
      </ScrollArea>
    </div>
  )
}

export default memo(RightMenu)
