import { X } from "lucide-react";
import { Button } from "../ui/button";
import ViewRender from "../general/ViewRender";
import { api } from "@faris/utils/api";
import { useEffect, useState } from "react";
import { PAGINATION } from "@faris/server/module/common/common.schema";
import useSessionStore from "zustandStore/userSessionStore";
import { useStoryGallary } from "zustandStore/storyGallaryStore";
import UserCardSkeleton from "../skeleton/UserCardSkeleton";
import CustomAvatar from "../general/CustomAvatar";
import Link from "next/link";

export default function StoryLikedList({ show, setShow, storyId }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>, storyId: string|null }) {
    const [currentPage, setCurrentPage] = useState(0)
    const requesterId = useSessionStore(state => state.user.id)
    const { loadLikeList, getCurrentStory, totalStories } = useStoryGallary()
    const { data, isLoading } = api.story.getLikeList.useQuery({ page: currentPage, range: PAGINATION.USERS, storyId:storyId??'', requesterId }, { enabled: !!storyId && !!storyId })

    const nextPage = () => {
        if (currentPage + 1 < totalStories) {
            setCurrentPage(currentPage + 1)
        }
    }

    useEffect(() => {
        if (data && data.data) {
            loadLikeList(getCurrentStory()?.owner?.id ?? '', getCurrentStory()?.id ?? '', data.data,data.hasMore)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])

    return (
        <div className={`${!show ? 'w-0 h-0' : 'w-3/4 h-72'} overflow-hidden  absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 fade-in-50 zoom-in-75 bg-accent transition-all duration-500 rounded-md shadow-md`}>
            <Button variant={'outline'} onClick={() => setShow(false)} className=" absolute top-2 right-2 w-fit h-fit p-1 rounded-full"><X className="w-3 h-3" /></Button>
            {show && <div className="absolute top-6 left-0 w-full h-full p-3">
                <ViewRender
                    illustrations='friends'
                    isGrid={false}
                    isLoading={isLoading}
                    data={getCurrentStory()?.likeList || []}
                    skeletonComonent={<UserCardSkeleton />}
                    noDataMessage={''}
                    nextPage={nextPage}
                    hasNextPage={getCurrentStory()?.hasMore?true:false}
                >
                    <div className='space-y-1'>
                        {getCurrentStory()?.likeList.map((user, i) => <div key={i} className="flex items-center gap-x-2 hover:cursor-pointer hover:bg-slate-700  border p-2 rounded-sm">
                            <CustomAvatar imageUrl={user.image?.url} alt={`${user?.fullName}_profile`} />
                            <Link className="text-sm " href={`/profile/${user.id}`}>{user.fullName}</Link>
                        </div>)}
                    </div>
                </ViewRender>
            </div>}
        </div>
    )
}
