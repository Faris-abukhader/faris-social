import { Card } from "@faris/components/ui/card";

export default function WriteCommentSkeleton() {
    return (
        <Card className="animate-pulse p-4 w-full border-none flex items-center justify-between gap-x-2">
            <div className="rounded-full skeleton-background h-9 w-9"></div>
            <div className="hidden sm:block w-full h-8 skeleton-background rounded-md"></div>
            <div className="hidden sm:block w-8 h-8 skeleton-background rounded-md"></div>
        </Card>
    )
}
