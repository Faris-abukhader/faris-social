import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Send } from 'lucide-react'
import { useCurrentConversationStore } from './MessageView'
import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import { useConversationListStore } from 'zustandStore/conversationStore'
import { useDataEffect } from '@faris/hooks/customDataLoader'
import Loading from '../general/Loading'
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import MessageRow from './MessageRow'
import { pusherClient } from '@faris/utils/pusherClient'
import { toPusherKey } from '@faris/utils/pusherUtils'
import { Events } from '@faris/server/module/event/event.schema'
import { type SendOneMessageParams } from '@faris/server/module/message/message.schema'
import ConversationHeader from './ConversationHeader'
import { pageToUser } from './conversation/ContactCard'
import { useQueryParam } from '@faris/hooks/useConversationParams'
import {type  TGetMiniUser } from '@faris/server/module/profile/profile.handler'

export default function MessageBox() {
  const [message, setMessage] = useState('')
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const { conversation: currentConversation } = useCurrentConversationStore(state => state)
  const { id: userId, fullName, image } = useSessionStore(state => state.user)
  const {setConversation,sendMessage,loadMessages,messageList,messageRange,currentMessagePage} = useCurrentConversationStore(state=>state)
  const { conversationId,conversationList, setMessageList,createConversation:createNewConversation } = useConversationListStore(state => state)
  const { data, isLoading } = api.message.getOneConversationMessageList.useQuery({ conversationId: currentConversation?.id ?? -1, page: currentMessagePage, range: messageRange }, { enabled: !!currentConversation })
  const { mutateAsync, isLoading: isSending } = api.message.sendOneMessage.useMutation()
  const { mutate: isWritingMutate } = api.message.isWriting.useMutation()
  const {value,set} = useQueryParam('conversation')
  const {value:contactId,remove} = useQueryParam('contactId')
  const {mutate,isLoading:isGettingConversation} = api.message.getOneConversation.useMutation({
      onSuccess(data) {
          setConversation(data)
      },
  })
  const {mutate:createConversation,isLoading:isCreatingConveration} = api.message.createNewConversation.useMutation({
    onSuccess(data) {
      setConversation(data)
      set(String(data.id))
      createNewConversation(data)
    },
  })

  useEffect(()=>{
    if(contactId && !isGettingConversation){
      const recieverId = contactId.split('_')[0]??''
      const recieverType = contactId.split('_')[1] as 'page'|'user'
      createConversation({ownerId:userId,recieverId,creatorType:'user',recieverType})
      remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[contactId])

  useEffect(()=>{
      if(value){
          const currentConversation = conversationList.map(conversation=>{
              if(conversation.id==Number(value)){
                  return conversation
              }
          }).at(0)
          if(currentConversation){
              setConversation(currentConversation)
          }else{
            mutate({conversationId:Number(value)})
          }
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value])

  useDataEffect<string>({
    data,
    currentPage: currentMessagePage,
    condition: currentMessagePage == 0 && messageList.length > 0 && conversationId == currentConversation?.id,
    target: String(conversationId),
    currentTarget: String(conversationId),
    loadFunction: loadMessages,
    setFunction: setMessageList
  })

  const handleSendMessage = async () => {
    if (!currentConversation?.id) return
    await mutateAsync({
      content: message,
      conversationId: currentConversation.id,
      sender: {
        id: userId,
        fullName,
        image: {
          url: image ?? '',
          thumbnailUrl: ''
        } || null
      },
      account: 'user'
    });
    setMessage('')
    return
  }

  // const getFriend = useCallback(() => currentConversation?.users.filter(user => user.id != userId).at(0), [currentConversation, userId])

  const getUser = useCallback(():{isUser:boolean}&TGetMiniUser|undefined=>{
    if(!currentConversation)return
    if(currentConversation.senderPage && currentConversation.senderPage.id!==userId){
        return pageToUser(currentConversation.senderPage)
    }else if (currentConversation.senderUser && currentConversation.senderUser.id!==userId){
        return {...currentConversation.senderUser,isUser:true}
    }else if (currentConversation.recieverPage && currentConversation.recieverPage.id !==userId){
        return pageToUser(currentConversation.recieverPage)
    }else if (currentConversation.recieverUser){
        return {...currentConversation.recieverUser,isUser:true}
    }else{
      return undefined
    }
},[currentConversation,userId])



  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current != null) {
      scrollTargetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [scrollTargetRef]);

  useEffect(() => {
    scrollToBottomOfList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTargetRef]);


  useEffect(() => {
    const currentFriend = getUser()

    if (currentConversation == undefined || currentFriend == undefined) return;

    pusherClient.subscribe(toPusherKey(`conversation:${currentConversation.id}`))

    const messageHandler = (message: SendOneMessageParams) => sendMessage({
      id: Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1,
      content: message.content,
      createdAt: new Date(),
      ...message.account == 'user' ? {
        userSender: {
          ...message.sender,
          bio: '',
          createdAt:new Date(),
        },
        pageSender: null
      } : {
        pageSender: {
          id: message.sender.id,
          title: message.sender.fullName,
          profileImage: message.sender.image,
          createdAt:new Date(),
          category:''
        },
        userSender: null
      }
    })

    pusherClient.bind(Events.COMING_MESSAGES, messageHandler)

    return () => {
        pusherClient.unsubscribe(toPusherKey(`conversation:${currentConversation.id}`))
        pusherClient.unbind(Events.COMING_MESSAGES, messageHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation])


  const typingTimeout = () => isWritingMutate({ userId, isTyping: false })
  let timeout: number | null = null; // Initialize the timeout variable
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      clearTimeout(timeout as number);
      isWritingMutate({ userId, isTyping: true });
    }
  };
  const handleKeyUp = () => {
    clearTimeout(timeout as number);
    timeout = window.setTimeout(typingTimeout, 3000);
  };


  if(isGettingConversation || isCreatingConveration) return<div className='flex items-center justify-center max-h-screen w-full'><Loading/></div>
  if (!currentConversation) return <div className='max-h-screen w-full' />
  return (
    <div className='max-h-screen w-full'>
      <ConversationHeader currentFriend={getUser()} conversationId={currentConversation.id} />
      <ScrollArea className='h-[53vh] p-2 pb-5'>
        <ul className='space-y-5 pt-4'>
          {isLoading ? <div className='w-full h-full flex items-center justify-center'><Loading /></div>
            :
            messageList.map((message, index) => <MessageRow key={index} isSender={userId == message.userSender?.id} message={message.content} createdAt={message.createdAt} />)
          }
        </ul>
        <div ref={scrollTargetRef}></div>
      </ScrollArea>
      <div className='relative px-2 pb-3 border-t pt-2'>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={async (e) => {
          e.preventDefault();

          await handleSendMessage();
        }}>
          <Input value={message}
            onChange={(e) => { setMessage(e.target.value) }}
            autoFocus
            className='rounded-full'
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
          {/* Todo . . . */}
          {/* handle the messages send by pages */}
          <Button type='submit' disabled={message.length == 0 || isSending} variant={'ghost'} className='absolute right-2 top-2 rounded-full'>{isSending ? <Loading /> : <Send />}</Button>
        </form>
      </div>
    </div>
  )
}
