import { type TGetOneMessage, type TGetOneConversation } from '@faris/server/module/message/message.handler'
import ConversationList from './conversation/ConversationList'
import MessageBox from './MessageBox'
import { create } from 'zustand'
import { PAGINATION } from '@faris/server/module/common/common.schema'

export default function MessageView() {
  return (
    <div className='w-full h-[100dvh] overflow-hidden flex items-start'>
        <ConversationList/>
        <MessageBox/>
    </div>
  )
}

type CurrentConversation = {
  conversation:TGetOneConversation|undefined,
  setConversation:(conversation:TGetOneConversation)=>void
  setMessageList: (data: TGetOneMessage[] | [], totalMessagePages: number,targetConversation:string) => void // for only custom data loader hook 
  loadMessages: (newMessageList: TGetOneMessage[], page: number,targetConversation:string) => void
  sendMessage: (newMessage: TGetOneMessage) => void,
  messageList:TGetOneMessage[],
  totalMessagePages:number
  messageRange: number,
  currentMessagePage: number,
  nextMessage: () => void,
  
}

export const useCurrentConversationStore = create<CurrentConversation>((set)=>({
  conversation:undefined,
  messageList:[],
  totalMessagePages: 0,
  messageRange: PAGINATION.MESSAGES,
  currentMessagePage: 0,
  nextMessage() {
      set(state=>({...state,currentMessagePage:state.currentMessagePage < state.totalMessagePages ? state.currentMessagePage+1:state.currentMessagePage}))
  },
  setConversation(conversation) {
    set({conversation,messageList:[],totalMessagePages:0,currentMessagePage:0})
  },
  setMessageList(data, totalMessagePages){
    set({messageList:data,totalMessagePages})
  },
  loadMessages(newConversationInvitationList) {
      set((state) => ({ messageList: [...state.messageList,...newConversationInvitationList], }))
  },
  sendMessage(newMessage) {
      set(state=>({...state,messageList:[...state.messageList,newMessage]}))
  },
}))