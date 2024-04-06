import { PAGINATION } from '@faris/server/module/common/common.schema'
import { create } from 'zustand'  
  
export type SearchingType = 'user' | 'group' | 'page' | 'hashtag' |'none'

type SearchingStore = {
    type: SearchingType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataList: any[] | []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: (data: any[] | [], page: number, type: SearchingType) => void
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadData: (data: any[] | [], page: number, type: SearchingType) => void
    reset:()=>void
    range: number,
    pages: number,
    currentPage: number,
    nextPage: () => void,
}

export const useSearchingStore = create<SearchingStore>((set) => ({
    type: 'none',
    dataList: [],
    setData: (data, pages, type) => {
        set(state=>({...state,dataList: data??[], pages, type,currentPage:0}))
    },
    loadData: (data, pages,type) => {
        set(state=>({...state,dataList: [...state.dataList??[],...data??[]], pages,type}))
    },
    reset() {
        set({dataList:[],pages:0,currentPage:0,type:'none'})
    },
    pages: 0,
    range: PAGINATION.SEARCHRESULTS,
    currentPage: 0,
    nextPage() {
        set(state => ({ ...state, currentPage: state.currentPage < state.pages ? state.currentPage + 1 : state.currentPage }))
    },
}))
