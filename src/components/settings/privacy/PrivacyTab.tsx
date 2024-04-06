import { memo } from 'react'
import UserBlockedList from './UserBlockedList'
import GroupMutedList from './GroupMutedList'
import useLocalizationStore from 'zustandStore/localizationStore'

const  PrivacyTab = ()=> {
  const language = useLocalizationStore(state=>state.language)
  return (
    <div dir={language=='ar'?'rtl':'ltr'} className=' space-y-10 pb-20'>
      <UserBlockedList/>
      <GroupMutedList/>
    </div>
  )
}

export default memo(PrivacyTab)