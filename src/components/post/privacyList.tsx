import { Globe2, Lock, Users2 } from "lucide-react"

export const privacyList = [
    {
        title: 'friends',
        icon: <Users2 className="w-3 h-3" />
    },
    {
        title: 'public',
        icon: <Globe2 className="w-3 h-3" />
    },
    {
        title: 'onlyMe',
        icon: <Lock className="w-3 h-3" />
    }
]