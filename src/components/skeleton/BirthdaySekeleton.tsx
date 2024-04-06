import { Card } from "../ui/card";

export default function BirthdaySekeleton() {
    return (
        <Card className="w-36 shadow-none border-none animate-pulse p-2  flex items-center gap-x-2">
            <div className="rounded-full skeleton-background h-6 w-6"></div>
            <div className="w-14 h-2 skeleton-background rounded"></div>
        </Card>
    )
}
