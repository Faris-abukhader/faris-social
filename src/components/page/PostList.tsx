import { api } from "@faris/utils/api"
import { useEffect } from "react"
import { usePostListStore } from "zustandStore/postListStore"
import useSessionStore from "zustandStore/userSessionStore"
import ViewRender from "../general/ViewRender"
import PostSkeleton from "../skeleton/PostSekeleton"
import PostCard from "../general/PostCard"
import CreatePostCard from "../post/CreatePostWidget"
import { type TGetOneMiniPage } from "@faris/server/module/page/page.handler"

interface PostListProps {
  pageId:string
  ownerId:string
  page:TGetOneMiniPage
}

export default function PostList({pageId,ownerId,page}:PostListProps) {
  const requesterId = useSessionStore(state=>state.user.id)
  const { postList,setPosts,loadPosts, setIsLoading,nextPage,totalPages,currentPage,range,setConversationId } = usePostListStore(state => state)
  const {mutate,isLoading} = api.page.postList.useMutation({
    onSuccess(data) {
      if(data && data.conversationId){
        setConversationId(data.conversationId)
      }
      currentPage==0 ? setPosts(data.data,data.pageNumber,data.isPageLiked):loadPosts(data.data,data.pageNumber,data.isPageLiked)
    },
    onSettled() {
      setIsLoading(false)
    },
  })

  useEffect(()=>{
    setIsLoading(true)
    requesterId && pageId && mutate({pageId,requesterId,page:currentPage,range})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[pageId,requesterId,currentPage])

  return (
    <div className='w-full max-w-lg space-y-3 scrollbar-hide'>
      {ownerId===requesterId &&<CreatePostCard authorType='page' holderType='page' page={page} pageId={pageId}/>}
         <ViewRender
          illustrations="posts"
          isGrid={false}
          isLoading={isLoading}
          data={postList || []}
          skeletonComonent={<PostSkeleton/>}
          noDataMessage={ownerId==requesterId ? 'yourPageHasNoPosts':'pageHasNoPosts'}
          nextPage={nextPage}
          hasNextPage={(totalPages - 1) > currentPage}          
          >
          <div className='space-y-3'>
          {postList.map((post, i) => <PostCard page={page} {...post} key={i} />) }
          </div>
        </ViewRender>
    </div>
  )
}