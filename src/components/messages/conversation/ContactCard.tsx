import { memo, useCallback } from "react"
import { Button } from "@faris/components/ui/button"
import CustomAvatar from "@faris/components/general/CustomAvatar"
import { type TGetOneConversation } from "@faris/server/module/message/message.handler"
import fromNow from "@faris/utils/fromNow"
import useSessionStore from "zustandStore/userSessionStore"
import { useQueryParam } from "@faris/hooks/useConversationParams"
import { useCurrentConversationStore } from "../MessageView"
import { type TGetOneMiniPage } from "@faris/server/module/page/page.handler"
import { type TGetMiniUser } from "@faris/server/module/profile/profile.handler"

interface ContactCardProps extends TGetOneConversation {
    isHover:boolean
}

export const pageToUser = (page:TGetOneMiniPage):TGetMiniUser&{isUser:boolean}=>{
    return{
        id:page.id,
        fullName:page.title,
        image:{
            thumbnailUrl:page.profileImage?.thumbnailUrl??'',
            url:page.profileImage?.url??''
        },
        bio:'',
        createdAt:page.createdAt,
        isUser:false
    }
}

const ContactCard = ({id,senderPage,senderUser,recieverPage,recieverUser,messageList,createdAt,isHover}:ContactCardProps) => {
    const userId = useSessionStore(state=>state.user.id)
    const setCurrentConveration = useCurrentConversationStore(state=>state.setConversation)
    const {set} = useQueryParam('conversation')
    // const getUser = ()=>users.filter(user=>user.id!=userId).at(0)
    const getUser = useCallback(()=>{
        if(senderPage && senderPage.id!==userId){
            return pageToUser(senderPage)
        }else if (senderUser && senderUser.id!==userId){
            return senderUser
        }else if (recieverPage && recieverPage.id !==userId){
            return pageToUser(recieverPage)
        }else{
            return recieverUser
        }
    },[senderPage,senderUser,recieverPage,recieverUser,userId])

    const onClickHandler = ()=>{
        set(String(id))
        setCurrentConveration({id,senderPage,senderUser,recieverPage,recieverUser,messageList,createdAt})
    }

    return (
        <Button onClick={onClickHandler} variant={'ghost'} className={`w-full h-fit text-start flex items-center justify-between p-0 ${isHover?'p-3':''} sm:p-3`}>
            <CustomAvatar imageUrl={getUser()?.image?.url??''} alt={`logo`} className="w-6 h-6 sm:w-10 sm:h-10"/>
            <div className='px-3 me-auto text-xs sm:text-md'>
                <h1>{getUser()?.fullName}</h1>
                <h4 className='text-xs opacity-70 line-clamp-1 w-[85%]'>{messageList.at(0)?.content}</h4>
            </div>
            <div className='text-[9px] sm:text-xs opacity-70'>{fromNow(messageList.at(0)?.createdAt??createdAt)}</div>
        </Button>
    )
}

export default memo(ContactCard)