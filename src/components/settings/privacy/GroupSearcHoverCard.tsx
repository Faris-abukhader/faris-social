import { Popover, PopoverTrigger, PopoverContent } from '@faris/components/ui/popover'
import { Input } from '@faris/components/ui/input'
import { Button } from '@faris/components/ui/button'
import { useDeferredValue, useEffect, useState } from 'react'
import { api } from '@faris/utils/api'
import CustomAvatar from '@faris/components/general/CustomAvatar'
import useSessionStore from 'zustandStore/userSessionStore'
import { type SearchHoverCardProps } from './UserSearchHoverCard'
import { useMutedListStore } from './GroupMutedList'
import { type MinGroup } from '@faris/server/module/group/group.handler'
import Loading from '@faris/components/general/Loading'

export default function GroupSearchHoverCard({ hearder, buttonTitle, placeholder }: SearchHoverCardProps) {
    const [query, setQuery] = useState('')
    const [show,setShow] = useState(true)
    const deferredQuery = useDeferredValue(query);
    const [data, setData] = useState<MinGroup[]>()
    const userId = useSessionStore(state=>state.user.id)
    const {push:pushUser,dataList:groupList} = useMutedListStore(state=>state)
    const { mutate, isLoading } = api.group.searchJoinedGroups.useMutation({
        onSuccess(data) {
            setData(data)
        },
    })
    const { mutate:groupProcedureMutate, isLoading: isGroupProceduring } = api.group.muteGroupProcedure.useMutation({
        onSuccess(data) {
            pushUser(data.targetGroup)
        },
        onSettled() {
            setShow(false)
        },
    })

    const handleOnClick = (targetId:string) => groupProcedureMutate({id:userId,targetGroup:targetId,toMute:true})

    useEffect(()=>{
        deferredQuery.length > 0 ? mutate({title:deferredQuery,userId,execptedList:groupList}):setData([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[deferredQuery])

    const listRender = () => {
        if (isLoading) return <h1>loading . . .</h1>
        if (data?.length == 0) return <h1>no data was found</h1>      
        return data?.map((record, index) =><div onClick={()=>handleOnClick(record.id)} key={index} className={"flex items-center hover:bg-accent hover:cursor-pointer gap-x-2 p-2 rounded-md"}>
            <CustomAvatar imageUrl={record?.profileImage?.url} alt={`${record?.title}_profile_img`} />
            <h1>{record?.title}</h1>
        </div>)
    }

    return (
        <Popover open={show} onOpenChange={setShow}>
            <PopoverTrigger asChild>
                <Button onClick={()=>setShow(true)}  variant="outline" className='w-full'>{buttonTitle}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <h4 className="font-medium leading-none">{hearder}</h4>
                    {isGroupProceduring && <Loading/>}
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
