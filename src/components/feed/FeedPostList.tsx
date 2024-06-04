import ViewRender from '../general/ViewRender'
import CreatePostCard from '../post/CreatePostWidget'
import useSessionStore from 'zustandStore/userSessionStore'
import { usePostListStore } from 'zustandStore/postListStore'
import { api } from '@faris/utils/api'
import PostSkeleton from '../skeleton/PostSekeleton'
import { type GetOnePost } from '@faris/server/module/post/post.handler'
import PostCard from '../general/PostCard'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function FeedPostList() {
    const userId = useSessionStore(state => state.user.id)
    const { postList, range, currentPage,loadFeedPosts,setFeedPosts, nextPage, totalPages,profileId } = usePostListStore()
    const { data, isLoading } = api.post.getNewFeed.useQuery({ userId, range, page: currentPage }, { enabled: !!userId })

    useDataEffect<string>({
        data,
        currentPage,
        condition: currentPage == 0 && postList.length > 0 && profileId == 'newFeed',
        target: 'newFeed',
        currentTarget: profileId,
        loadFunction: loadFeedPosts,
        setFunction: setFeedPosts
    })

    return (
        <div className='space-y-2 pb-16'>
            <CreatePostCard />
            <ViewRender
                illustrations='posts'
                isGrid={false}
                isLoading={isLoading}
                data={postList || []}
                skeletonComonent={<PostSkeleton />}
                noDataMessage={'noPostForNewFeed'}
                nextPage={nextPage}
                hasNextPage={totalPages - 1 > currentPage}
            >
                <div className='w-full space-y-4 scrollbar-hide'>
                    {postList && postList.length > 0 && postList.map((post, i) => <PostCard {...post as GetOnePost} key={i} />)}
                </div>
            </ViewRender>
        </div>
    )
}
