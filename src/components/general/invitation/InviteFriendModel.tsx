import { Button } from "@faris/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@faris/components/ui/dialog"
import { Input } from "@faris/components/ui/input"
import { api } from "@faris/utils/api";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useDeferredValue, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { create } from "zustand";
import useSessionStore from "zustandStore/userSessionStore";
import FriendCard from "./FriendCard";
import ViewRender from "@faris/components/general/ViewRender";
import UserCardSkeleton from "@faris/components/skeleton/UserCardSkeleton";
import Loading from "@faris/components/general/Loading";
import { type MiniUser } from "@faris/server/module/common/common.schema";
import { useToast } from "@faris/components/ui/use-toast";
import useLocalizationStore from "zustandStore/localizationStore";


export default function InviteFriendModel() {
    const language = useLocalizationStore(state=>state.language)
    const { t } = useTranslation()
    const {toast} = useToast()
    const { show, setShow, getSelectedList, selectedList, setUserList, userList,id,target, add, remove,reset } = useFriendInvitationModel(state => state)
    const userId = useSessionStore(state => state.user.id)
    const [query, setQuery] = useState('')
    const deferredQuery = useDeferredValue(query);
    const { mutate, isLoading } = api.profile.searchFriend.useMutation({
        onSuccess(data) {
            setUserList(data.data)
        },
    })
    const {mutate:inviteManyToPageHandler,isLoading:isInvitingToPageLoading} = api.pageInvitation.createMany.useMutation({
        onSuccess(data) {
            if(data.code==200){
                setShow(false)
                reset()
                toast({
                    title:t('invitationWasSentSuccessfully')
                })
            }       
        },
    })

    const {mutate:inviteManyToGroupHandler,isLoading:isInvitingToGroupLoading} = api.group.inviteUsersToJoin.useMutation({
        onSuccess(data) {
            if(data.code==200){
                setShow(false)
                reset()
                toast({
                    title:t('invitationWasSentSuccessfully')
                })
            }
        },
    })

    const {mutate:inviteManyToEventHandler,isLoading:isInvitingToEventLoading} = api.event.inviteUsers.useMutation({
        onSuccess(data) {
            if(data.code==200){
                setShow(false)
                reset()
                toast({
                    title:t('invitationWasSentSuccessfully')
                })
            }
        },
    })

    useEffect(() => {
        mutate({ userId, query: deferredQuery, execptedList: getSelectedList(),page:0,range:100 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deferredQuery])

    const clickHandler = ()=> {
        const params = {senderId:userId,recievers:getSelectedList()}

        switch(target){
            case 'page':
                return inviteManyToPageHandler({pageId:id,...params})
            case 'group':
                return inviteManyToGroupHandler({groupId:id,...params})
            case 'event':
                return inviteManyToEventHandler({eventId:id,...params})
            default:
                return inviteManyToPageHandler({pageId:id,...params}) 
        }
    }

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="p-5 sm:max-w-[500px] sm:max-h-[480px] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className=" capitalize">{t('inviteFriends')}</DialogTitle>
                </DialogHeader>
                <section className=" space-y-3">
                    <Input placeholder={t('pageName')} value={query} onChange={(e) => setQuery(e.target.value)} />
                    <ViewRender
                        illustrations='friends'
                        isGrid={false}
                        lengthOfSkeleton={3}
                        isLoading={isLoading}
                        illustrationSize={{width:160,height:160}}
                        data={Array.from(userList.values()) || []}
                        skeletonComonent={<UserCardSkeleton />}
                        noDataMessage={'noFriendSearchFound'}
                        hasNextPage={false}              
                    >
                        <ScrollArea className="w-full h-[200px]">
                            {Array.from(userList.values()).map((friend) => <FriendCard className="hover:cursor-pointer hover:bg-accent" onClick={() => add(friend)} user={friend} key={friend.id} />)}
                        </ScrollArea>
                    </ViewRender>
                </section>
                <h1 dir={language=='ar'?'rtl':'ltr'} className="border-t pt-3 mt-3">{t('selectedUser')}</h1>
                <section>
                <ViewRender
                        illustrations='events'
                        isGrid={true}
                        illustrationSize={{width:160,height:160}}
                        isLoading={false}
                        data={Array.from(userList.values()) || []}
                        skeletonComonent={<></>}
                        noDataMessage={'noFriendAddedToList'}
                        hasNextPage={false}              
                    >
                        <div className="flex items-center gap-2"></div>
                    {Array.from(selectedList.values()).map(user => <h1 onClick={() => remove(user.id)} className="p-2 border w-fit rounded-md hover:cursor-pointer hover:bg-accent" key={user.id}>{user.fullName}</h1>)}
                    </ViewRender>
                </section>
                <DialogFooter>
                    <Button onClick={clickHandler} disabled={selectedList.length == 0 || isInvitingToEventLoading || isInvitingToGroupLoading || isInvitingToPageLoading}>{isInvitingToEventLoading || isInvitingToGroupLoading || isInvitingToPageLoading ? <Loading/>:t('confirm')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export type Target = 'page'|'group'|'event'

type FriendInvitationModel = {
    show: boolean,
    id:string,
    target:Target|null,
    setOpen:(id:string,target:Target)=>void
    setShow: (show: boolean) => void
    selectedList: MiniUser[]
    add: (user: MiniUser) => void
    remove: (userId: string) => void
    getSelectedList: () => { id: string }[]
    userList: MiniUser[]
    setUserList: (users: MiniUser[]) => void
    reset:()=>void
}

export const useFriendInvitationModel = create<FriendInvitationModel>((set, get) => ({
    selectedList:[],
    show: false,
    id:'',
    target:null,
    setOpen(id,target) {
        set({show:true,id,target,selectedList:[]})
    },
    setShow(show) {
        set({ show })
    },
    add(user) {
        set(state => ({ ...state, selectedList: [user,...state.selectedList] }))
    },
    remove(userId) {
        set(state => ({...state,userList:state.userList.filter(user=>user.id!=userId)}))
    },
    getSelectedList() {
        return Array.from(get().selectedList.values()).map((user) => ({ id: user.id }));
    },
    userList: [],
    setUserList(users) {
        set({userList:users})
    },
    reset() {
        set({selectedList:[],show:false,id:'',target:null})
    },

}))