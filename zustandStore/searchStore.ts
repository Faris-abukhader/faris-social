import { create } from 'zustand'

type Search = {
    searchQuery: string,
    tap?: string,
    setQuery:(newQuery:string)=>void,
    setTap:(newTap:string)=>void,
    search: (query:string,tap?:string) => void,
}

const useSearch = create<Search>((set) => ({
    searchQuery: '',
    setQuery(searchQuery) {
        set({ searchQuery })
    },
    setTap(tap) {
        set({ tap })
    },
    search(searchQuery,tap) {
        set({ searchQuery,tap:tap?tap:undefined })
    },
}))

export default useSearch;