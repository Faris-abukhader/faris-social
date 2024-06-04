import { useDeferredValue, useEffect, useState } from 'react'
import { ScrollArea } from '../../ui/scroll-area'
import { Input } from '../../ui/input'
import ContactCard from './ContactCard'
import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import { useConversationListStore } from 'zustandStore/conversationStore'
import ViewRender from '../../general/ViewRender'
import UserCardSkeleton from '../../skeleton/UserCardSkeleton'
import { useTranslation } from 'next-i18next';import { useHover } from '@faris/hooks/useHover'
import { Skeleton } from '@faris/components/ui/skeleton'
import { CreateNewConversationModel } from './CreateNewConversationModel'

export default function ContactList() {
    const { t } = useTranslation()
    const {ref,hovered} = useHover()
    const [isSmallScreen,setIsSmallScreen] = useState(false)
    const [query, setQuery] = useState('')
    const deferredQuery = useDeferredValue(query);
    const userId = useSessionStore(state => state.user.id)
    const { setConversationList, loadConversations, totalConversationPages, searchConversation, conversationList, filteredConversationList, currentConversationPage, nextConversation, conversationRange } = useConversationListStore(state => state)
    const { data, isLoading } = api.message.getOneUserConversationList.useQuery({ userId, page: currentConversationPage, range: conversationRange }, { enabled: !!userId }) // cache for one minute

    useEffect(() => {

        if (!data) return

        if (currentConversationPage === 0 &&
            currentConversationPage == 0 &&
            conversationList.length > 0) return;

        conversationList.length == 0
            ?
            setConversationList(data.data, data.pageNumber)
            :
            loadConversations(data.data, data.pageNumber);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, currentConversationPage]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => searchConversation(deferredQuery, userId), [deferredQuery])



    useEffect(() => {
        const handleResize = () => {
            if(ref && ref.current){
                setIsSmallScreen((ref.current?.offsetWidth < 50 && !hovered) ? true:false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        }
      }, [hovered,ref]);


    return (
        <div ref={ref} className='w-11 hover:w-full transition-all duration-500  border-e sm:w-full max-h-screen'>
            <section className='p-3 space-y-2'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-lg font-bold capitalize hidden sm:block'>{t('messages')}</h1>
                    <CreateNewConversationModel/>
                </div>
                <Input placeholder='' onChange={(e) => setQuery(e.target.value)} className='rounded-full hidden sm:block' />
            </section>
            <ScrollArea className='w-full h-[80vh] pb-8 px-2'>
                <ViewRender
                    illustrations={isSmallScreen ? 'none':'messages'}
                    isGrid={false}
                    isLoading={isLoading}
                    data={query.length > 0 ? filteredConversationList : conversationList || []}
                    skeletonComonent={isSmallScreen ? <Skeleton className='w-5 h-5 rounded-full'/>:<UserCardSkeleton />}
                    noDataMessage={query.length > 0 ? 'noFriendSearchFound' : 'noConversationNotice'}
                    nextPage={nextConversation}
                    hasNextPage={(totalConversationPages - 1) > currentConversationPage}          
                >
                    <div className='py-3'>
                        {query.length > 0 ? filteredConversationList.map((conversation, i) => <ContactCard key={i} {...conversation} isHover={hovered} />) : conversationList.map((conversation, i) => <ContactCard key={i} {...conversation} isHover={hovered} />)}
                    </div>
                </ViewRender>
            </ScrollArea>
        </div>
    )
}