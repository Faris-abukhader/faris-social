import { api } from "@faris/utils/api"
import { useEffect } from "react"
import useSessionStore from "zustandStore/userSessionStore"
import ViewRender from "../general/ViewRender"
import PostSkeleton from "../skeleton/PostSekeleton"
import CreatePostCard from "../post/CreatePostWidget"
import { type Status, useGroupPostListStore } from "zustandStore/groupPostListStore"
import GroupPostCard from "../general/GroupPostCard"
import { type TGetOneMiniGroup } from "@faris/server/module/group/group.handler"

interface PostListProps {
  group:TGetOneMiniGroup
  ownerId:string
}

export default function PostList({ownerId,group}:PostListProps) {
  const requesterId = useSessionStore(state=>state.user.id)
  const { postList,setData,loadData,totalPages,nextPage,currentPage,range,status } = useGroupPostListStore(state => state)
  const {mutate,isLoading} = api.group.postList.useMutation({
    onSuccess(data) {
      currentPage==0 ? setData(data.data,data.pageNumber,data.status as Status):loadData(data.data,data.pageNumber,data.status as Status)
    },
  })

  useEffect(()=>{
    requesterId && group && group.id && mutate({groupId:group.id,requesterId,page:currentPage,range})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[group,requesterId,currentPage])

  
  return (
    <div className='w-full max-w-lg space-y-3 scrollbar-hide'>
      {(status=='joined' || ownerId==requesterId) && <CreatePostCard authorType='user' holderType='group' groupId={group.id}/>}
         <ViewRender
          illustrations={status=='joined' || ownerId==requesterId ? "posts":'secure'} 
          isGrid={false}
          isLoading={isLoading}
          data={postList || []}
          skeletonComonent={<PostSkeleton/>}
          noDataMessage={status=='joined' || ownerId==requesterId ? 'groupHasNoPosts':'groupIsPrivateNotice'}
          nextPage={nextPage}
          hasNextPage={totalPages-1 > currentPage}
        >
          <div className='space-y-3'>
          {postList.map((post, i) => <GroupPostCard group={group} {...post} key={i} />) }
          </div>
        </ViewRender>
    </div>
  )
}