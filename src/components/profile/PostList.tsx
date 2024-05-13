import useSessionStore from 'zustandStore/userSessionStore'
import PostCard from '../general/PostCard'
import SharedPostCard from '../general/SharedPostCard'
import { usePostListStore } from 'zustandStore/postListStore'
import CreatePostCard from '../post/CreatePostWidget'
import PostSkeleton from '../skeleton/PostSekeleton'
import { type GetOnePost, type GetOneSharedPost } from '@faris/server/module/post/post.handler'
import ViewRender from '../general/ViewRender'
import { api } from '@faris/utils/api'
import { memo, useEffect } from 'react'
import { PAGINATION } from '@faris/server/module/common/common.schema'

interface PostListProps { 
  id:string
}

const PostList =({id}:PostListProps)=> {
  const {postList,isLoading} = usePostListStore(state=>state)
  const userId = useSessionStore(state=>state.user.id)
  const requesterId = useSessionStore(state => state.user.id)
  const { setPosts, setIsLoading,nextPage,currentPage,totalPages, setProfileId } = usePostListStore(state => state)
  const { mutate } = api.post.getOneProfilePostList.useMutation({
    onMutate() {
      setIsLoading(true)
    },
    onError(error) {
        console.log({error})
    },
    onSuccess(data) {
      if (data && data.data) {
        console.log({pageNumber:data.pageNumber})
        setPosts(data.data,data.pageNumber)
        setProfileId(id)
      }
    },
    onSettled() {
      setIsLoading(false)
    },
  })

  useEffect(() => {
    if(requesterId && id)
    mutate({ id, requesterId, page: currentPage, range: PAGINATION.POSTS })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id,requesterId])

  return (
    <div className='w-full max-w-lg space-y-4'>
      <CreatePostCard/>
      <ViewRender
        illustrations='posts'
        isGrid={false}
        isLoading={isLoading}
        data={postList || []}
        skeletonComonent={<PostSkeleton/>}
        noDataMessage={id==userId?'youDonotHaveAnyPost':'noPostFoundForThisAccount'}
        nextPage={nextPage}
        hasNextPage={totalPages - 1 > currentPage}
      >
        <div className='w-full max-w-lg space-y-4 scrollbar-hide'>
        {postList && postList.length > 0 && postList.map((post,i)=> post.type=='shared' ? 
        <SharedPostCard {...post as GetOneSharedPost} key={i}/>
        :
        <PostCard {...post as GetOnePost} key={i}/>)}
        </div>
      </ViewRender>
    </div> 
  )
}

export default memo(PostList)