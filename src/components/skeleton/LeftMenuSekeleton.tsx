import { Card } from '../ui/card'

export default function LeftMenuSekeleton() {
    return (
        <Card className="w-full bg-transparent animate-pulse p-2 border-none shadow-none flex items-center gap-x-2">
            <div className="rounded-full skeleton-background h-6 w-6"></div>
            <div className="w-14 h-2 skeleton-background rounded"></div>
        </Card>
    )
}