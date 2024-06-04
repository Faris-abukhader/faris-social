import { memo, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import CustomAvatar from '../general/CustomAvatar'
import { useTranslation } from 'next-i18next';import { type TGetMiniUser } from '@faris/server/module/profile/profile.handler'
import { type IsTypeingParams } from '@faris/server/module/message/message.schema'
import { pusherClient } from '@faris/utils/pusherClient'
import { toPusherKey } from '@faris/utils/pusherUtils'
import { Events } from '@faris/server/module/event/event.schema'
import IsOnline from '../general/IsOnline'
import { type SetProfileOnlineParams } from '@faris/server/module/profile/profile.schema'

interface ConversationHeaderProps {
    currentFriend?: {isUser:boolean}&TGetMiniUser|null
    conversationId: number
}

const ConversationHeader = ({ currentFriend, conversationId }: ConversationHeaderProps) => {
    const { t } = useTranslation()
    const [isFriendTyping, setIsFriendTyping] = useState(false);
    const [isOnline,setIsOnline] = useState(false)

    const handleIsTyping = (data: IsTypeingParams) => {
        if (data.userId == currentFriend?.id) {
            setIsFriendTyping(data.isTyping)
        }
    }

    // todo
    const handleIsOnline = (data:SetProfileOnlineParams)=> {console.log('from isOnline connection channel',data);setIsOnline(data.isOnline)}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMemberRemoved = (member: any) => {
        console.log(`User has left the channel`,member);
        // Handle the event, update online status, etc.
      };
      
    useEffect(() => {

        if (conversationId == -1 || currentFriend == undefined) return;

        const presenceChannel = pusherClient.subscribe(toPusherKey(`isOnline:${currentFriend.id}`))
        pusherClient.subscribe(toPusherKey(`conversation:isTyping:${currentFriend.id}`))
        pusherClient.bind(Events.IS_TYPING, handleIsTyping)
        pusherClient.bind(Events.IS_ONLINE, handleIsOnline)
        presenceChannel.bind('pusher:member_removed', handleMemberRemoved);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`conversation:isTyping:${currentFriend.id}`))
            pusherClient.unbind(Events.IS_TYPING, handleIsTyping)
            pusherClient.unsubscribe(toPusherKey(`isOnline:${currentFriend.id}`))
            pusherClient.unbind(Events.IS_ONLINE, handleIsOnline)
            presenceChannel.unbind('pusher:member_removed', handleMemberRemoved);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFriend, conversationId])


    return <Button variant={'ghost'} className='w-full h-[25dvh] space-y-2 py-5 pt-20 border-b rounded-none'>
        <Link href={`/${currentFriend?.isUser?'profile':'page'}/${currentFriend?.id ?? ''}`} className='space-y-2'>
            <div className='w-fit h-fit relative mx-auto'>
            <CustomAvatar imageUrl={currentFriend?.image?.url} alt={`profile`} />
            <IsOnline isOnline={isOnline} className='absolute bottom-0 right-0' />
            </div>
            <h1 className='text-lg font-bold'>{currentFriend?.fullName} {isFriendTyping && <span className='text-xs opacity-70'>{t('typing')}</span>}</h1>
            <h4 className='text-xs opacity-70'>{t('joined&Date', { date: currentFriend?.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' }) })}</h4>
        </Link>
    </Button>
}

export default memo(ConversationHeader);