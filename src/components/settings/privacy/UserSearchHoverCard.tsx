import { Popover, PopoverTrigger, PopoverContent } from '@faris/components/ui/popover'
import { Input } from '@faris/components/ui/input'
import { Button } from '@faris/components/ui/button'
import { useDeferredValue, useEffect, useState } from 'react'
import { api } from '@faris/utils/api'
import CustomAvatar from '@faris/components/general/CustomAvatar'
import useSessionStore from 'zustandStore/userSessionStore'
import { useBlockListStore } from './UserBlockedList'
import { type MiniUser } from '@faris/server/module/common/common.schema'
import Loading from '@faris/components/general/Loading'
import { useTranslation } from 'next-i18next'
import useLocalizationStore from 'zustandStore/localizationStore'

export interface SearchHoverCardProps {
    hearder: string
    buttonTitle: string
    placeholder: string
}

export default function UserSearchHoverCard({ hearder, buttonTitle, placeholder }: SearchHoverCardProps) {
    const language = useLocalizationStore(state=>state.language)
    const {t} = useTranslation()
    const [query, setQuery] = useState('')
    const [show,setShow] = useState(true)
    const deferredQuery = useDeferredValue(query);
    const [data, setData] = useState<MiniUser[]>()
    const userId = useSessionStore(state=>state.user.id)
    const {push:pushUser,dataList:userList} = useBlockListStore(state=>state)
    const { mutate, isLoading } = api.profile.searchFriend.useMutation({
        onSuccess(data) {
            setData(data.data)
        },
    })
    const { mutate:userProcedureMutate, isLoading: isUserProceduring } = api.profile.blockUserProcedure.useMutation({
        onSuccess(data) {
            if(data && data.blockedUser)
            pushUser(data.blockedUser)
        },
        onSettled() {
            setShow(false)
        },
    })

    const handleOnClick = (targetId:string) => userProcedureMutate({id:userId,targetUserId:targetId,toBlock:true})

    useEffect(()=>{
        deferredQuery.length > 0 ? mutate({query:deferredQuery,userId,execptedList:userList,page:0,range:100}):setData([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[deferredQuery])

    const listRender = () => {
        if (isLoading) return <h1>{t('loading')}</h1>
        if (data?.length == 0) return <h1>{t('noDataFound')}</h1>      
        return data?.map((record, index) =><div onClick={()=>handleOnClick(record?.id)} key={index} className={"flex items-center hover:bg-accent hover:cursor-pointer gap-x-2 p-2 rounded-md"}>
            <CustomAvatar imageUrl={record?.image?.url} alt={`${record.fullName}_profile_img`} />
            <h1>{record.fullName}</h1>
        </div>)
    }

    return (
        <Popover open={show} onOpenChange={setShow}>
            <PopoverTrigger asChild>
                <Button onClick={()=>setShow(true)}  variant="outline" className='w-full'>{buttonTitle}</Button>
            </PopoverTrigger>
            <PopoverContent dir={language=='ar'?'rtl':'ltr'} className="w-80">
                <div className="grid gap-4">
                    <h4 className="font-medium leading-none">{hearder}</h4>
                    {isUserProceduring && <Loading/>}
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="h-8"
                    />
                </div>
                <div className='py-3'>{listRender()}</div>
            </PopoverContent>
        </Popover>
    )
}
