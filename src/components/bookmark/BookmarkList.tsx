import { api } from '@faris/utils/api'
import { memo, useEffect } from 'react'
import { usePostListStore } from 'zustandStore/postListStore'
import useSessionStore from 'zustandStore/userSessionStore'
import PostSkeleton from '../skeleton/PostSekeleton'
import PostCard from '../general/PostCard'
import { type GetOneSharedPost, type GetOnePost } from '@faris/server/module/post/post.handler'
import SharedPostCard from '../general/SharedPostCard'
import ViewRender from '../general/ViewRender'

const BookmarkList = () => {
  const ownerId = useSessionStore(state => state.user.id)
  const {
    setProfileId,
    setPosts,
    postList,
    currentPage,
    totalPages,
    range,
    nextPage
  } = usePostListStore(state => state)
  const { data, isLoading } = api.bookmark.getOneUser.useQuery({ ownerId, range, page: currentPage }, { enabled: !!ownerId })

  useEffect(() => {
    if (!!data && !!data.data && data.data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setPosts(data.data,data.pageNumber)
      setProfileId(`bookmark.${ownerId}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
      <div className='w-full max-w-lg- space-y-4 scrollbar-hide'>
         <ViewRender
          illustrations='posts'
          isGrid={false}
          isLoading={isLoading}
          data={data?.data || []}
          skeletonComonent={<PostSkeleton/>}
          noDataMessage={'youDonotHaveAnyPostInBookmark'}
          nextPage={nextPage}
          hasNextPage={totalPages-1 > currentPage}
        >
          <div className='py-3 space-y-2 pb-12'>
          {postList.map((post, i) => post.type=='shared' ? 
          <SharedPostCard key={i} isBookmark={true} bookmarkId={post.bookmarkId??-1} {...post as GetOneSharedPost}/>
          :
          <PostCard isBookmark={true} bookmarkId={post?.bookmarkId} {...post as GetOnePost} key={i} />) }
          </div>
        </ViewRender>
      </div>
  )
}

export default memo(BookmarkList)