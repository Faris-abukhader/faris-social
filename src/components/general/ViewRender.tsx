import { type ReactElement, type ReactNode } from "react";
import IllustrationContainer from "./IllustrationContainer";
import React from "react";
import { Button } from "../ui/button";
import { useTranslation } from "next-i18next";

type ViewRenderProps<T> = {
    isLoading: boolean;
    data?: T[];
    skeletonComonent: ReactElement;
    noDataMessage: string;
    children?:ReactNode,
    isGrid:boolean,
    illustrations:'checkIn'|'events'|'friends'|'location'|'pages'|'party'|'photos'|'posts'|'groups'|'secure'|'noResult'|'messages'|'notification'|'none'|'blocked'|'hashtag'
    lengthOfSkeleton?:number
    illustrationSize?:{width:number,height:number}
    hasNextPage:boolean
    nextPage?:()=>void
};

export default function ViewRender<T>({
    isLoading,
    data,
    skeletonComonent,
    noDataMessage,
    children,
    isGrid,
    illustrations,
    lengthOfSkeleton=9,
    illustrationSize={
        width:250,
        height:250
    },
    nextPage,
    hasNextPage
}: ViewRenderProps<T>): ReactNode {
    const {t} = useTranslation()

    if (isLoading)return <div className={`${isGrid ? 'grid gap-3 ':'space-y-3'} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-3`}>
        {Array.from({ length: lengthOfSkeleton }).map((_, i) => React.cloneElement(skeletonComonent, { key: i }))}
    </div>

    if (data && data.length > 0 && !isLoading) {
        return <div>
        {children}
        {hasNextPage && nextPage &&<div className="w-full flex justify-center pt-2">
            <Button onClick={nextPage} variant={'link'}>{t('seeMore')}</Button>
        </div>}
        </div>
    } else {
        if(illustrations=='none')return <></>
        return <IllustrationContainer width={illustrationSize.width} height={illustrationSize.height} className='mt-10' path={`/illustrations/${illustrations}.svg`} description={t(noDataMessage)} />;
    }
}

