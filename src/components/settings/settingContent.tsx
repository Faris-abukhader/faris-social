import  { memo, useCallback, useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import AccountTab from './AccountTab'
import ProfileTab from './ProfileTab'
import PrivacyTab from './privacy/PrivacyTab'
import { useTranslation } from 'next-i18next';import { useRouter } from 'next/router'

const settingTabs = ['account','profile','safety&privacy'] as const 

const SettingContent = ()=> {
  const { t } = useTranslation()
  const { push, query, isReady } = useRouter()
  const [currentTap, setCurrentTap] = useState('account')

  useEffect(() => {
    isReady && setCurrentTap(query?.tap as string ?? 'account')
  }, [isReady, query?.tap])

  // when user click in any time we update the state holder of tabs and update the url quey
  const updateTap = useCallback((newTap: string) => {
    setCurrentTap(newTap)
    void push({ query: { ...query, tap: newTap } }, undefined, { shallow: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Tabs value={currentTap} className="w-full p-5">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        {settingTabs.map(tap=><TabsTrigger key={tap} onClick={() => updateTap(tap)} value={tap}>{t(tap)}</TabsTrigger>)}
      </TabsList>
      <TabsContent value="account" className='pb-20'>
        <AccountTab />
      </TabsContent>
      <TabsContent value="profile" className='pb-20'>
        <ProfileTab />
      </TabsContent>
      <TabsContent value="safety&privacy" className='pb-20'>
        <PrivacyTab />
      </TabsContent>
    </Tabs>
  )
}

export default memo(SettingContent)