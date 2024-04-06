import useSessionStore from 'zustandStore/userSessionStore'
import { api } from '@faris/utils/api'
import ViewRender from '@faris/components/general/ViewRender'
import { usePostListStore } from 'zustandStore/postListStore'
import PostSkeleton from '../skeleton/PostSekeleton'
import GroupPostCard from '../general/GroupPostCard'
import { useDataEffect } from '@faris/hooks/customDataLoader'

export default function Feed() {
  const userId = useSessionStore(state => state.user.id)
  const { groupPost, setGroupPost, loadGroupPost, nextPage, totalPages, profileId, currentPage, range } = usePostListStore(state => state)
  const { data, isLoading } = api.group.getOneUserGroupFeeds.useQuery({ userId, page: currentPage, range }, { enabled: !!userId, cacheTime: 60 }) // cache the result for one minute

  useDataEffect<string>({
    data,
    currentPage,
    condition: currentPage == 0 && groupPost.length > 0 && profileId == 'feed',
    target: profileId,
    currentTarget: 'feed',
    loadFunction: loadGroupPost,
    setFunction: setGroupPost
  })

  console.log(groupPost)
  return (
    <div className='pt-5 pb-20'>
      <ViewRender
        illustrations='groups'
        isGrid={false}
        isLoading={isLoading}
        data={groupPost}
        skeletonComonent={<PostSkeleton />}
        noDataMessage={'youDonotHaveAnyNewGroupNewPost'}
        nextPage={nextPage}
        hasNextPage={totalPages - 1 > currentPage}
      >
        <div className='flex justify-center w-full sm:max-w-4xl'>
          <div className='w-full grid grid-cols-1 gap-3 py-3'>
            {groupPost.map(group => group && group.postList.map((post, index) => <GroupPostCard group={group} key={index} {...post} />))}
          </div>
        </div>
      </ViewRender>
    </div>
  )
}
