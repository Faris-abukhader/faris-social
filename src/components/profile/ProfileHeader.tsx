import { Button } from '../ui/button'
import { MailPlus, UserCheck, UserMinus, UserPlus } from 'lucide-react'
import { useTranslation } from 'next-i18next';
import { UpdateProfileDialog } from './UpdateProfileModel'
import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import ImageCover from '../general/ImageCover'
import ImageProfile from '../general/ImageProfile'
import { memo, useCallback, useEffect, useState } from 'react'
import Loading from '../general/Loading'
import { type GetOneProfile } from '@faris/server/module/profile/profile.handler'
import ButtonSkeleton from '../skeleton/ButtonSekeleton'
import CustomAvatar from '../general/CustomAvatar'
import QRcodeReviewer from '@faris/components/general/QRcodeReviewer';
import Link from 'next/link'
import ShareStory from '../story/ShareStory'
import { useToast } from '../ui/use-toast'
import useLocalizationStore from 'zustandStore/localizationStore';

const ProfileHeader = ({ fullName, bio, status, livingLocation, fromLocation, coverImage, image, _count, friends, id,blockedList }: GetOneProfile)=> {
  const { t } = useTranslation()
  const language = useLocalizationStore(state=>state.language)
  const {toast} = useToast()
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null)
  const sessionId = useSessionStore(state => state.user.id)
  const isReady = useSessionStore(state => state.isReady)
  const [conversationId,setConversationId] = useState<number>(-1)
  const { mutate: coverMutate } = api.profile.updateProfileCover.useMutation()
  const { mutate: imageMutate } = api.profile.updateProfileImage.useMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [requestId, setRequestId] = useState<number | null>(null)
  const { mutate: isAvailableForFriendRequest } = api.addFriend.friendAvailability.useMutation({
    onMutate() {
      setIsLoading(true)
    },
    onSuccess(data) {
      setFriendshipStatus(data.status)
      setRequestId(data.id)
      if(data && data.conversationId){
        setConversationId(data.conversationId)
      }
    },
    onSettled() {
      setIsLoading(false)
    }
  })
  
  const { mutate: addFriend, isLoading: isAddFriendDone } = api.addFriend.sendRequest.useMutation({
    onSuccess() {
      toast({
        title:t('addFriendRequestWasSentSuccessfully')
      })
    },
  })
  const { mutate: acceptFriend, isLoading: isAcceptFriendDone } = api.addFriend.responeOneRequest.useMutation({
    onSuccess() {
      toast({
        title:t('friendRequestAcceptedSuccessfully')
      })
    },
  })


  // check first if the user is in the blocked list of current account
  const isBlocked = useCallback(()=>{
    if(blockedList?.indexOf(sessionId)!== -1){
      return true 
    }
    return false
  },[blockedList,sessionId])


  // send request to check if there are friend or sending request is still pending 
  useEffect(() => {
    if (id && sessionId && sessionId !== id && isReady && !isBlocked()) {
      isAvailableForFriendRequest({ id: sessionId, possibleFriendId: id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id,isBlocked])


  return (
    <div dir={language=='ar'?'rtl':'ltr'} className='w-full'>
      <ImageCover id={id} isOwner={sessionId == id} coverImage={coverImage} mutate={coverMutate} />
      <div className='flex-row sm:flex space-y-4 sm:space-y-0 items-center justify-between py-6 '>
        <div className='flex-row space-y-5 sm:space-y-0 sm:flex items-center gap-x-4'>
          <ImageProfile id={id} image={image} isOwner={sessionId == id} mutate={imageMutate} />
          <div className='sm:-mt-4'>
            <h1 className='font-bold text-2xl sm:text-lg'>{fullName}</h1>
            {bio && <p className='block sm:hidden py-4 text-xs'>{bio}</p>}
            {!isBlocked() &&<p className='hidden sm:block text-xs'>{_count?.friendList + _count?.friendOf} {t('friends')}</p>}
            {!isBlocked&&<ul className='hidden sm:flex -gap-x-3'>
              {friends && friends.map((friend) =><CustomAvatar key={friend.id} className='shadow-sm w-6 h-6' imageUrl={friend.image?.url??''} alt={`@${fullName}_profile_img`} />)}
            </ul>}
          </div>
        </div>
        <div className='flex items-center justify-end sm:justify-start gap-x-2'>
          {isLoading && <ul className='flex items-center'>
            {Array.from({ length: 2 }).map((_, i) => <ButtonSkeleton key={i} />)}
          </ul>}
          {/* accept request */}
          {requestId && friendshipStatus && friendshipStatus == 'responseOne' && <Button className='w-full sm:w-fit gap-x-1' disabled={friendshipStatus.toString() == 'pending' || isAddFriendDone} onClick={() => acceptFriend({ id: requestId, status: 'accept' })}>
            <UserCheck className='w-3 h-3' />
            <span>{isAcceptFriendDone ? <Loading /> : t('acceptFriend')}</span>
          </Button>}
          {/* decline request */}
          {requestId && friendshipStatus && friendshipStatus == 'responseOne' && <Button className='w-full sm:w-fit gap-x-1' disabled={friendshipStatus.toString() == 'pending' || isAddFriendDone} onClick={() => acceptFriend({ id: requestId, status: 'decline' })}>
            <UserMinus className='w-3 h-3' />
            <span>{isAcceptFriendDone ? <Loading /> : t('delineFriend')}</span>
          </Button>}
          {/* available to send add request */}
          {friendshipStatus && friendshipStatus == 'available' && <Button className='w-full sm:w-fit gap-x-1' disabled={isAddFriendDone} onClick={() => addFriend({ senderId: sessionId, recieverId: id })}>
            <UserPlus className='w-3 h-3' />
            <span>{isAddFriendDone ? <Loading /> : (friendshipStatus.toString() == 'available' ? t('addFriend') : t('waitingForResponse'))}</span>
          </Button>}
          {/* waiting for user to accept our request */}
          {friendshipStatus && friendshipStatus == 'pending' && <Button className='w-full sm:w-fit gap-x-1' disabled={true}>
            <UserPlus className='w-3 h-3' />
            <span>{t('waitingForResponse')}</span>
          </Button>}
          {/* if the user is the owner of the profile he/she can add story */}
          {sessionId == id && <ShareStory type='square'/>}
          {sessionId != id && friendshipStatus && friendshipStatus == 'friend' && <Link href={`/messages?${conversationId!=-1?`conversation=${conversationId}`:`contactId=${id}_user`}`}><Button className='w-full sm:w-fit gap-x-1'>
            <MailPlus className='w-3 h-3' />
            <span>{t('sendMessage')}</span>
          </Button>
          </Link>}
          {id && sessionId && id == sessionId && <UpdateProfileDialog {...{ bio, fullName, status, livingLocation, fromLocation, id }} />}
         {!isBlocked() &&<QRcodeReviewer path={id} target='profile'/>}
        </div>
      </div>
    </div>
  )
}

export default memo(ProfileHeader);


// import { Button } from '../ui/button'
// import { MailPlus, UserCheck, UserMinus, UserPlus } from 'lucide-react'
// import { useTranslation } from 'next-i18next';
// import { UpdateProfileDialog } from './UpdateProfileModel'
// import useSessionStore from 'zustandStore/userSessionStore'
// import { api } from '@faris/utils/api'
// import ImageCover from '../general/ImageCover'
// import ImageProfile from '../general/ImageProfile'
// import { memo, useCallback, useEffect, useMemo, useState } from 'react'
// import Loading from '../general/Loading'
// import { type GetOneProfile } from '@faris/server/module/profile/profile.handler'
// import ButtonSkeleton from '../skeleton/ButtonSekeleton'
// import CustomAvatar from '../general/CustomAvatar'
// import QRcodeReviewer from '@faris/components/general/QRcodeReviewer';
// import Link from 'next/link'
// import ShareStory from '../story/ShareStory'
// import { useToast } from '../ui/use-toast'
// import useLocalizationStore from 'zustandStore/localizationStore';

// // todo
// const ProfileHeader = ({ fullName, bio, status, livingLocation, fromLocation, coverImage, image, _count, friends, id, blockedList }: GetOneProfile)=> {
//   const { t } = useTranslation()
//   const language = useLocalizationStore(state=>state.language)
//   const {toast} = useToast()
//   const sessionId = useSessionStore(state => state.user.id)
//   const isReady = useSessionStore(state => state.isReady)
//   const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null)
//   const [requestId, setRequestId] = useState<number | null>(null)
//   const [conversationId, setConversationId] = useState<number>(-1)
//   const { mutate: coverMutate } = api.profile.updateProfileCover.useMutation()
//   const { mutate: imageMutate } = api.profile.updateProfileImage.useMutation()
//   const { mutate: handleFriendRequest, isLoading } = api.addFriend.sendRequest.useMutation({
//     onSuccess(data) {
//       setFriendshipStatus(data.status)
//       setRequestId(data.id)
//       if (data.conversationId) {
//         setConversationId(data.conversationId)
//       }
//       toast({
//         title: t('addFriendRequestWasSentSuccessfully')
//       })
//     },
//   })

//   const isBlocked = useCallback(() => blockedList.includes(sessionId), [blockedList, sessionId])

//   const friendsList = useMemo(() => (
//     <ul className='hidden sm:flex -gap-x-3'>
//       {friends.map((friend) => (
//         <CustomAvatar
//           key={friend.id}
//           className='shadow-sm w-6 h-6'
//           imageUrl={friend.image?.url ?? ''}
//           alt={`@${fullName}_profile_img`}
//         />
//       ))}
//     </ul>
//   ), [friends, fullName])

//   const handleAddFriend = useCallback(() => {
//     handleFriendRequest({ senderId: sessionId, recieverId: id })
//   }, [handleFriendRequest, id, sessionId])

//   const handleAcceptFriend = useCallback(() => {
//     handleFriendRequest({ id: requestId, status: 'accept' })
//   }, [handleFriendRequest, requestId])

//   useEffect(() => {
//     if (id && sessionId && sessionId !== id && isReady && !isBlocked()) {
//       api.addFriend.friendAvailability.fetch({ id: sessionId, possibleFriendId: id }).then((data) => {
//         setFriendshipStatus(data.status)
//         setRequestId(data.id)
//         if (data.conversationId) {
//           setConversationId(data.conversationId)
//         }
//       })
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, isBlocked, isReady, sessionId])

//   return (
//     <div dir={language==='ar'?'rtl':'ltr'} className='w-full'>
//       <ImageCover id={id} isOwner={sessionId == id} coverImage={coverImage} mutate={coverMutate} />
//       <div className='flex-row sm:flex space-y-4 sm:space-y-0 items-center justify-between py-6 '>
//         <div className='flex-row space-y-5 sm:space-y-0 sm:flex items-center gap-x-4'>
//           <ImageProfile id={id} image={image} isOwner={sessionId == id} mutate={imageMutate} />
//           <div className='sm:-mt-4'>
//             <h1 className='font-bold text-2xl sm:text-lg'>{fullName}</h1>
//             {bio && <p className='block sm:hidden py-4 text-xs'>{bio}</p>}
//             {!isBlocked() && <p className='hidden sm:block text-xs'>{_count?.friendList + _count?.friendOf} {t('friends')}</p>}
//             {!isBlocked && friendsList}
//           </div>
//         </div>
//         <div className='flex items-center justify-end sm:justify-start gap-x-2'>
//           {isLoading && <ul className='flex items-center'>
//             {Array.from({ length: 2 }).map((_, i) => <ButtonSkeleton key={i} />)}
//           </ul>}
//           {requestId && friendshipStatus === 'responseOne' && (
//             <>
//               <Button className='w-full sm:w-fit gap-x-1' onClick={handleAcceptFriend} disabled={isLoading}>
//                 <UserCheck className='w-3 h-3' />
//                 <span>{isLoading ? <Loading /> : t('acceptFriend')}</span>
//               </Button>
//               <Button className='w-full sm:w-fit gap-x-1' onClick={() => handleFriendRequest({ id: requestId, status: 'decline' })} disabled={isLoading}>
//                 <UserMinus className='w-3 h-3' />
//                 <span>{isLoading ? <Loading /> : t('delineFriend')}</span>
//               </Button>
//             </>
//           )}
//           {friendshipStatus === 'available' && (
//             <Button className='w-full sm:w-fit gap-x-1' onClick={handleAddFriend} disabled={isLoading}>
//               <UserPlus className='w-3 h-3' />
//               <span>{isLoading ? <Loading /> : t('addFriend')}</span>
//             </Button>
//           )}
//           {friendshipStatus === 'pending' && (
//             <Button className='w-full sm:w-fit gap-x-1' disabled={true}>
//               <UserPlus className='w-3 h-3' />
//               <span>{t('waitingForResponse')}</span>
//             </Button>
//           )}
//           {sessionId == id && <ShareStory type='square'/>}
//           {sessionId != id && friendshipStatus === 'friend' && (
//             <Link href={`/messages?${conversationId !== -1 ? `conversation=${conversationId}` : `contactId=${id}_user`}`}>
//               <Button className='w-full sm:w-fit gap-x-1'>
//                 <MailPlus className='w-3 h-3' />
//                 <span>{t('sendMessage')}</span>
//               </Button>
//             </Link>
//           )}
//           {id && sessionId && id == sessionId && <UpdateProfileDialog {...{ bio, fullName, status, livingLocation, fromLocation, id }} />}
//           {!isBlocked && <QRcodeReviewer path={id} target='profile'/>}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default memo(ProfileHeader);
