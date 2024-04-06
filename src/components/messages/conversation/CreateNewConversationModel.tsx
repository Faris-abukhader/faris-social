import CustomAvatar from "@faris/components/general/CustomAvatar"
import Loading from "@faris/components/general/Loading"
import ViewRender from "@faris/components/general/ViewRender"
import UserCardSkeleton from "@faris/components/skeleton/UserCardSkeleton"
import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@faris/components/ui/dialog"
import { Input } from "@faris/components/ui/input"
import { ScrollArea } from "@faris/components/ui/scroll-area"
import { type MiniUser } from "@faris/server/module/common/common.schema"
import { api } from "@faris/utils/api"
import { MessageSquarePlus } from "lucide-react"
import { useDeferredValue, useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { createStore } from "zustandStore/GeneralStore"
import { useConversationListStore } from "zustandStore/conversationStore"
import useSessionStore from "zustandStore/userSessionStore"
import { useCurrentConversationStore } from "../MessageView"
import { useQueryParam } from "@faris/hooks/useConversationParams"


const store = createStore(12)

export function CreateNewConversationModel() {
    const { t } = useTranslation()
    const [show,setShow] = useState(false)
    const userId = useSessionStore(state => state.user.id)
    const [query, setQuery] = useState('')
    const deferredQuery = useDeferredValue(query);
    const { dataList, setData, loadData, nextPage,reset, pages, currentPage, range } = store(state => state)
    const createConversation = useConversationListStore(state => state.createConversation)
    const setCurrentConveration = useCurrentConversationStore(state=>state.setConversation)
    const {set} = useQueryParam('conversation')
    const { mutate, isLoading } = api.profile.searchFriend.useMutation({
        onSuccess(data) {
            currentPage == 0 ? setData(data.data, data.pageNumber, 'none') : loadData(data.data, data.pageNumber, 'none')
        },
    })
    const { mutate: conversationMutate,isLoading:isCreatingConversation } = api.message.createNewConversation.useMutation({
        onSuccess(data) {
            setShow(false)
            createConversation(data)
            set(String(data.id))
            setCurrentConveration(data)
        },
    })

    useEffect(() => {
        deferredQuery.length != 0 ? mutate({ query, userId, page: currentPage, range }) : reset()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deferredQuery, currentPage])

    return (
        <Dialog open={show} onOpenChange={setShow}>
                <Button onClick={()=>setShow(!show)}  variant={'ghost'} className='rounded-full w-fit h-fit  sm:w-10 sm:h-10 p-0'><MessageSquarePlus className='w-5 h-5' /></Button>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('newMessage')}</DialogTitle>
                </DialogHeader>
                <Input value={query} onChange={e => setQuery(e.target.value)} />
                <ScrollArea className='h-fit  max-h-[40vh]'>
                <ViewRender
                    illustrations='noResult'
                    isGrid={false}
                    isLoading={isLoading}
                    data={dataList}
                    skeletonComonent={<UserCardSkeleton />}
                    noDataMessage={'noFriendSearchFound'}
                    illustrationSize={{ width: 140, height: 140 }}
                    nextPage={nextPage}
                    hasNextPage={pages - 1 > currentPage}
                >
                    <ScrollArea className='h-fit  max-h-[40vh]'>
                        {dataList && dataList.map((data: MiniUser) => <div onClick={() => conversationMutate({ ownerId: userId,recieverId:data.id,recieverType:'user',creatorType:'user' })} key={data.id} className='flex items-center justify-between pb-2'>
                            <div className={`w-full p-2 rounded-sm hover:cursor-pointer relative flex items-center gap-x-2 hover:bg-accent transition-colors duration-500`}>
                                <CustomAvatar imageUrl={data.image?.url ?? ''} alt={`${data.fullName}_profile_img`} />
                                <h1 className={`${isCreatingConversation?'opacity-10':''}`}>{data.fullName}</h1>
                                <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ${isCreatingConversation?'opacity-100':'opacity-0'} `}><Loading/></div>
                            </div>
                        </div>)}
                    </ScrollArea>
                </ViewRender>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
