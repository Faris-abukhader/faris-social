import CustomAvatar from "@faris/components/general/CustomAvatar";
import { Button } from "@faris/components/ui/button";
import { Card } from "@faris/components/ui/card";
import { type TGetOneJoinGroupRequest } from "@faris/server/module/group/group.handler";
import { useTranslation } from "next-i18next";
import { useRequestStore } from "./JoinGroupRequestList";
import { api } from "@faris/utils/api";
import useSessionStore from "zustandStore/userSessionStore";
import Link from "next/link";
import { useToast } from "@faris/components/ui/use-toast";

export default function JoinGroupRequestCard({id,applier,group}:TGetOneJoinGroupRequest) {
    const {t} = useTranslation()
    const{toast} = useToast()
    const removeRequest = useRequestStore(state=>state.deleteRecord)
    const ownerId = useSessionStore(state=>state.user.id)
    const {mutate,isLoading} = api.group.joinGroupProcedure.useMutation({
        onSuccess(data) {
            removeRequest(id)
            if(data.isAccepted){
                toast({
                    title:t('groupJoinedSuccessfully')
                })
            }
        },
    })
  return <Card className="flex items-center justify-between p-4">
    <section className="flex items-center gap-x-2">
        <CustomAvatar imageUrl={applier.image?.url} alt={applier.fullName}/>
        <Link href={`/profile/${applier.id}`} className="hover:text-blue-500 hover:dark:text-blue-800 duration-500 transition-colors">{applier.fullName}</Link>
    </section>
    <section className="flex items-center gap-x-2"> 
        <Button disabled={isLoading} onClick={()=>mutate({groupId:group.id,ownerId,isAccepted:true,requestId:id,requesterId:applier.id})} variant={'secondary'} size={'sm'}>{t('confirm')}</Button>
        <Button disabled={isLoading} onClick={()=>mutate({groupId:group.id,ownerId,isAccepted:false,requestId:id,requesterId:applier.id})} variant={'destructive'} size={'sm'}>{t('cancel')}</Button>
    </section>
  </Card>
}
