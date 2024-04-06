import { create } from 'zustand'  
  
export type Target = 'none'|string

type GeneralStore = {
    target: Target,
    dataList: any[] | []
    setData: (data: any[] | [], page: number, type: Target) => void
    loadData: (data: any[] | [], page: number, type: Target) => void
    deleteRecord:(id:any)=>void
    reset:()=>void
    range: number,
    pages: number,
    currentPage: number,
    nextPage: () => void,
}

export const createStore = (pagination:number)=> create<GeneralStore>((set) => ({
    target: 'none',
    dataList: [],
    setData: (data, pages, type) => {
        set(state=>({...state,dataList: data??[], pages, type,currentPage:0}))
    },
    loadData: (data, pages,type) => {
        set(state=>({...state,dataList: [...state.dataList??[],...data??[]], pages,type}))
    },
    deleteRecord(id) {
        console.log('Deleting record with id:', id);
        set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const newDataList = state.dataList.filter((record) => record.id !== id);
            console.log('New dataList:', newDataList);
            return { dataList: newDataList };
        });
    },
    reset() {
        set({dataList:[],pages:0,currentPage:0,target:'none'})
    },
    pages: 0,
    range: pagination,
    currentPage: 0,
    nextPage() {
        set(state => ({ ...state, currentPage: state.currentPage < state.pages ? state.currentPage + 1 : state.currentPage }))
    },
}))