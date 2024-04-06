import { create } from 'zustand'
import { type TGetOneConversation,type TGetOneMessage } from '@faris/server/module/message/message.handler'
import { PAGINATION } from '@faris/server/module/common/common.schema'

type ConversationStore = {
    conversationId:number
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    conversationList: TGetOneConversation[] | []
    filteredConversationList:TGetOneConversation[]|[],
    messageList : TGetOneMessage[] | []
    setConversationList: (data: TGetOneConversation[] | [], totalConversationPages: number) => void
    setMessageList: (data: TGetOneMessage[] | [], totalMessagePages: number,targetConversation:string) => void // for only custom data loader hook 
    deleteConversation: (conversationId: number) => void
    createConversation: (newConversation: TGetOneConversation) => void
    loadConversations: (newConversationList: TGetOneConversation[], page: number) => void
    loadMessages: (newMessageList: TGetOneMessage[], page: number,targetConversation:string) => void
    sendMessage: (newMessage: TGetOneMessage) => void,
    searchConversation:(username:string,userId:string)=>void
    totalConversationPages:number,
    conversationRange: number,
    currentConversationPage: number,
    nextConversation: () => void,
    totalMessagePages:number
    messageRange: number,
    currentMessagePage: number,
    nextMessage: () => void,
}
export const useConversationListStore = create<ConversationStore>((set,get) => ({
    isLoading: false,
    conversationId:-1,
    conversationList: [],
    filteredConversationList:[],
    messageList:[],
    setConversationList: (data, totalConversationPages) => {
        set({ conversationList: data, totalConversationPages})
    },
    setMessageList(data, totalMessagePages,targetConversation){
        set({messageList:data,totalMessagePages,conversationId:Number(targetConversation)})
    },
    setIsLoading(isLoading) {
        set({ isLoading })
    },
    deleteConversation: (conversationId) => {
        set((state) => ({
            conversationList: state.conversationList.filter((conversation) => conversation.id !== conversationId),
        }));
    },
    createConversation(newConversation) {
        set(state => ({ conversationList: [newConversation, ...state.conversationList] }))
    },
    loadConversations(newConversationList, conversations) {
        set((state) => ({ conversationList: [...state.conversationList,...newConversationList], conversations }))
    },
    loadMessages(newConversationInvitationList, conversations,targetConversation) {
        set((state) => ({ messageList: [...state.messageList,...newConversationInvitationList], conversations,conversationId:Number(targetConversation) }))
    },
    totalConversationPages: 0,
    conversationRange: 1, //PAGINATION.CONVERSATIONS,
    currentConversationPage: 0,
    nextConversation() {
        set(state=>({...state,currentConversationPage:state.currentConversationPage < state.totalConversationPages ? state.currentConversationPage+1:state.currentConversationPage}))
    },
    totalMessagePages: 0,
    messageRange: PAGINATION.MESSAGES,
    currentMessagePage: 0,
    nextMessage() {
        set(state=>({...state,currentMessagePage:state.currentMessagePage < state.totalMessagePages ? state.currentMessagePage+1:state.currentMessagePage}))
    },
    sendMessage(newMessage) {
        set(state=>({...state,messageList:[...state.messageList,newMessage]}))
    },
    searchConversation(username,userId) {
        const filteredConversationList = get().conversationList.filter((conversation) => {
            const senderUserId = conversation.senderUser?.id
            const senderPageId = conversation.senderPage?.id
            const receiverUserId = conversation.recieverUser?.id
            if(userId==senderUserId){
                return conversation.senderUser?.fullName.toLowerCase().includes(username.toLowerCase())
            }else if(userId==senderPageId){
                return conversation.senderPage?.title.toLowerCase().includes(username.toLowerCase())
            }else if (userId==receiverUserId){
                return conversation.recieverUser?.fullName.toLowerCase().includes(username.toLowerCase())
            }else {
                return conversation.recieverPage?.title.toLowerCase().includes(username.toLowerCase())
            }
        });
        set({filteredConversationList})
    },
}))