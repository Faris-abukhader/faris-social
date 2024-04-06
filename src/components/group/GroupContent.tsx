import React, { useCallback, useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import PostList from './PostList'
import IntroTab from './intro/IntroWidget'
import { useTranslation } from 'next-i18next';import { type TGetOneFullGroup } from '@faris/server/module/group/group.handler'
import { useRouter } from 'next/router'
import useSessionStore from 'zustandStore/userSessionStore'
import JoinGroupRequestList from './joinGroup/JoinGroupRequestList'

interface GroupContentProps {
  group: TGetOneFullGroup
}

const taps = ['posts', 'about'] as const

export default function GroupContent({ group }: GroupContentProps) {
  const { t } = useTranslation()
  const [currentTap, setCurrentTap] = useState('posts')
  const { push, query, isReady } = useRouter()
  const userId = useSessionStore(state=>state.user.id)

  useEffect(() => {
    isReady && setCurrentTap(query?.tap as string ?? 'posts')
  }, [isReady, query?.tap])

  // when user click in any time we update the state holder of tabs and update the url quey
  const updateTap = useCallback((newTap: string) => {
    setCurrentTap(newTap)
    void push({ query: { ...query, tap: newTap } }, undefined, { shallow: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Tabs value={currentTap} className="w-full pb-20">
      <TabsList className={`grid w-full ${userId==group?.owner?.id?'grid-cols-3':'grid-cols-2'} mb-4`}>
        {taps.map(tap=><TabsTrigger key={tap} value={tap} onClick={() => updateTap(tap)}>{t(tap)}</TabsTrigger>)}
        {userId==group?.owner?.id && <TabsTrigger value={'requests'} onClick={() => updateTap('requests')}>{t('joinGroupRequest')}</TabsTrigger>}
      </TabsList>
        <TabsContent value="posts" className='flex md:gap-x-2 items-start justify-center md:justify-start'>
        <PostList group={group} ownerId={group?.owner?.id} />
        <div className='w-full space-y-4 hidden md:block'>
          <IntroTab {...group} />
        </div>
      </TabsContent>
      <TabsContent value="about">
        <IntroTab {...group} />
      </TabsContent>
      {userId==group?.owner?.id &&<TabsContent value="requests">
        <JoinGroupRequestList groupId={group.id}/>
      </TabsContent>}
    </Tabs>
  )
}
