import { Card } from "../ui/card"

export default function LastPhotosSkeleton (){
    return (
      <Card className="w-full animate-pulse p-4  rounded-md shadow-md grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((v, i) => <div key={i} className="w-20 h-20  skeleton-background rounded-md"></div>
        )}
      </Card>
    )
  }
  
  