import { Plus } from "lucide-react";
import { Button } from "@faris/components/ui/button";
import { type TGetOneFullGroup } from "@faris/server/module/group/group.handler";
import ImageCover from "../general/ImageCover";
import useSessionStore from "zustandStore/userSessionStore";
import { api } from "@faris/utils/api";
import InviteFriendModel, { useFriendInvitationModel } from "../general/invitation/InviteFriendModel";
import { useTranslation } from "next-i18next";
import ImageProfile from "../general/ImageProfile";
import QRcodeReviewer from "../general/QRcodeReviewer";
import { useGroupPostListStore } from "zustandStore/groupPostListStore";

export default function GroupHeader({ id, coverImage,profileImage, title, owner,isPrivate }: TGetOneFullGroup) {
  const { t } = useTranslation()
  const userId = useSessionStore(state => state.user.id)
  const {status,setStatus} = useGroupPostListStore(state=>state)
  const { mutate: coverMutation } = api.group.changeCover.useMutation()
  const { mutate: profileMutation } = api.group.changeProfile.useMutation()
  const { show, setOpen } = useFriendInvitationModel(state => state)
  const {mutate:joiningGroupMutate,isLoading:isJoiningGroup} = api.group.userGroupProcedure.useMutation({
    onSuccess(data) {
      setStatus(data.wannaJoin ? 'joined':'unjoined')
    },
  })
  const {mutate:sendJoinRequestMutate,isLoading:isSendingJoingRequest} = api.group.sendJoinGroupRequest.useMutation({
    onSuccess() {
      setStatus('pending')
    },
  })


  const handleJoinGroup = ()=>{
    switch(status){
      case 'joined':
        joiningGroupMutate({groupId:id,userId,wannaJoin:false})
        return
      case 'unjoined':
          if(isPrivate){
            sendJoinRequestMutate({groupId:id,applierId:userId})
          }else{
            joiningGroupMutate({groupId:id,userId,wannaJoin:true})
          }
        return
      case 'pending':
        return
      default:
        return
    }
    // if(isGroupJoined){
    //   // disjoin the group "Leave"
    //   joiningGroupMutate({groupId:id,userId,wannaJoin:false})
    // }else{
    //   if(!isPrivate){
    //     // sending join request to group admin
    //     sendJoinRequestMutate({groupId:id,applierId:userId})
    //   }else{
    //     // joining the group immediately
    //     joiningGroupMutate({groupId:id,userId,wannaJoin:true})
    //   }
    // }
  }

  const getButtonLabel = ()=>{
    switch(status){
      case 'joined':
        return 'leave'
      case 'unjoined':
        return 'join'
      case 'pending':
        return 'pending'
      default:
        return 'join'
    }
  }

  return (<div className='w-full'>
    <div className='relative w-full h-560 sm:h-80 md:h-96 rounded-b-md shadow-sm'>
      <ImageCover id={id} isOwner={userId == owner?.id} coverImage={coverImage} mutate={coverMutation} />
    </div>
    <div className='flex-row sm:flex space-y-4 sm:space-y-0 items-center justify-between py-6 '>
      <div className="flex items-center gap-x-2">
    <ImageProfile id={id} image={profileImage} isOwner={userId == owner?.id} mutate={profileMutation} />
      <h1 className='font-bold text-2xl sm:text-4xl'>{title}</h1>
      </div>
      <div className='flex items-center justify-end sm:justify-start gap-x-2'>
        <Button onClick={() => setOpen(id, 'group')} className='w-full sm:w-fit gap-x-1'>
          <Plus className='w-3 h-3' />
          <span>{t('invite')}</span>
        </Button >
        <QRcodeReviewer path={id} target='group'/>
        <Button disabled={isJoiningGroup || isSendingJoingRequest || status=='pending'} onClick={handleJoinGroup} variant={'outline'} className=" gap-x-1"><Plus className={`w-3 h-3 ${isJoiningGroup || isSendingJoingRequest||status=='pending'?'hidden':''}`}/>{!isJoiningGroup && !isSendingJoingRequest &&<>{t(getButtonLabel())}</>}</Button>
      </div>
    </div>
    {show && <InviteFriendModel />}
  </div>)
}