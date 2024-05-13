import { type FormEvent, useEffect } from 'react'
import { Input } from '../ui/input'
import { useRouter } from 'next/router'
import { Search } from 'lucide-react'
import useSearch from 'zustandStore/searchStore'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { useSearchingStore } from 'zustandStore/searchingStore'

const resultType = ['top', 'latest', 'people', 'pages', 'groups','hashtag']

export default function SearchingNavigator() {
    const { searchQuery, setQuery, tap, setTap } = useSearch(state => state)
    const resetSearchStore = useSearchingStore(state=>state.reset)
    const { query, replace } = useRouter()

    useEffect(() => {        
        query.tap ? setTap(query.tap as string) : setTap('top')
    }, [query, setTap])

    useEffect(() => {
        setQuery(query.query as string ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateQuery = (newQuery: string) => {
        setTap(newQuery)
        const oldQuery = query
        oldQuery.tap = newQuery
        void replace({ query: oldQuery })
    }

    const searchHandler = (e: FormEvent) => {
        e.preventDefault()
        const newQuery = query
        newQuery.query = searchQuery
        void replace({ query: newQuery })
        resetSearchStore()
    }

    return (
        <div className=''>
            <section className='px-6 pt-8 py-4'>
                <div className='w-full relative'>
                    <form onSubmit={searchHandler}>
                        <Input value={searchQuery} onChange={(e) => setQuery(e.target.value)} className='rounded-full pl-8' />
                    </form>
                    <Search className='w-4 h-4 absolute left-3 -translate-y-1/2 top-1/2' />
                </div>
            </section>
            <section className='relative border-b-pb-3'>
                <Tabs value={tap} className="w-full sm:px-2">
                    <TabsList className={`grid w-full grid-cols-6 ${resultType.length}`}>
                        {resultType.map((item, index) => <TabsTrigger onClick={() => updateQuery(item)} key={index} value={item}>{item}</TabsTrigger>)}
                    </TabsList>
                </Tabs>
            </section>
        </div>
    )
}
