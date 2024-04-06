import { create } from 'zustand'
import { type TGetOnePage,type TGetOnePageInvitation } from '@faris/server/module/page/page.handler'
import { PAGINATION } from '@faris/server/module/common/common.schema'

type PageStore = {
    target: string | null,
    type: 'page'|'invitation',
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    pageList: TGetOnePage[] | []
    invitationList : TGetOnePageInvitation[] | []
    setPages: (data: TGetOnePage[] | [], page: number, target: string) => void
    setPageInvitations: (data: TGetOnePageInvitation[] | [], page: number, target: string) => void
    updatePage: (pageId: string, updatedData: TGetOnePage) => void
    deletePage: (pageId: string) => void
    createPage: (newPage: TGetOnePage,target?:string) => void
    loadPages: (newPageList: TGetOnePage[], page: number) => void
    loadInvitations: (newPageInvitationList: TGetOnePageInvitation[], page: number) => void
    likePage: (pageId: string, userId: string) => void,
    disLikePage: (pageId: string) => void,
    range: number,
    pages: number,
    currentPage: number,
    nextPage: () => void,
}
export const usePageListStore = create<PageStore>((set) => ({
    target: 'none',
    isLoading: false,
    type:'page',
    pageList: [],
    invitationList:[],
    setPages: (data, pages, target) => {
        set({ pageList: data, pages, target,type:'page' })
    },
    setPageInvitations(data, pages, target){
        set({invitationList:data,pages,target,type:'invitation'})
    },
    setIsLoading(isLoading) {
        set({ isLoading })
    },
    updatePage: (pageId, updatedData) => {
        set((state) => ({
            pageList: state.pageList.map((page) =>
                page.id === pageId ? { ...page, ...updatedData } : page
            ),
        }));
    },
    deletePage: (pageId) => {
        set((state) => (state.type=='page' ? {
            pageList: state.pageList.filter((page) => page.id !== pageId),
        }:{
            invitationList:state.invitationList.filter(invitation=> invitation.id!==pageId)
        }));
    },
    createPage(newPage,target) {
        set(state => ({ pageList: [newPage, ...state.pageList],target:target?target:state.target }))
    },
    loadPages(newPageList, pages) {
        set((state) => ({ pageList: [...newPageList, ...state.pageList], pages }))
    },
    loadInvitations(newPageInvitationList, pages) {
        set((state) => ({ invitationList: [...newPageInvitationList, ...state.invitationList], pages }))
    },
    pages: 0,
    range: PAGINATION.PAGES,
    currentPage: 0,
    nextPage() {
        this.currentPage < this.pages && set((state) => ({ currentPage: state.currentPage + 1 }))
    },
    likePage(pageId, userId) {
        set((state)=>({
            pageList:state.pageList.map(page=>{
                if(page.id===pageId){
                    return {...page,_count:{...page._count,likeList:page._count.likeList+1},likeList:[{id:userId,fullName:'',bio:'',image:{url:'',thumbnailUrl:''},createdAt:new Date()}]}
                }
                return page
             })
        }))
    },
    disLikePage(pageId) {
        set((state)=>({
            pageList:state.pageList.map(page=>{
                if(page.id===pageId){
                    return {...page,_count:{...page._count,likeList:page._count.likeList-1},likeList:[]}
                }
                return page
             })
        }))
    },

}))