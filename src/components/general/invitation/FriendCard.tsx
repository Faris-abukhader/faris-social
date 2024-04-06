import {forwardRef} from 'react'
import { cn } from '@faris/utils/tailwindHelper'
import CustomAvatar from '@faris/components/general/CustomAvatar';
import { type MiniUser } from '@faris/server/module/common/common.schema';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    user: MiniUser;
}
  
const FriendCard = forwardRef<
  HTMLDivElement,
  CardHeaderProps  
> (({ className,user, ...props }, ref) => (
    <div ref={ref} {...props} className={cn("flex items-center gap-x-2 p-2 rounded-md",className)}>
        <CustomAvatar imageUrl={user?.image?.url} alt={user?.fullName} />
        <h1>{user.fullName}</h1>
</div>
))
FriendCard.displayName = 'FriendCard'

export default FriendCard