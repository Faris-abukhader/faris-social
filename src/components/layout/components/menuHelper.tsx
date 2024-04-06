import { Bike,Bookmark, Book, Cake, CalendarCheck2Icon, CalendarDays, Cog, Dumbbell, Flag, Gamepad2, HeartHandshake, HeartPulse, HelpingHand, Home, Laugh, Network, Newspaper, Radar, Scissors, ShoppingCart, Shovel, Smile, ThumbsUp, Tv, User, UserPlus, Users, Users2Icon, Utensils, Group, MessagesSquare } from 'lucide-react'

export type ListType = {
    title: string
    href: string
    Icon: React.JSX.Element
}

export const helper = (type: string): ListType[] => {
    switch (type) {
      case 'pages':
        return [
          {
            title: 'yourPages',
            href: `/pages/your-pages`,
            Icon: <Flag className='w-6 h-6' />
          },
          {
            title: 'discover',
            href: `/pages/discover`,
            Icon: <Radar className='w-6 h-6' />
          },
          {
            title: 'likedPages',
            href: `/pages/liked-pages`,
            Icon: <ThumbsUp className='w-6 h-6' />
          },
          {
            title: 'invitations',
            href: `/pages/invitations`,
            Icon: <UserPlus className='w-6 h-6' />
          },
        ]
      case 'groups':
        return [
          {
            title: 'yourFeed',
            href: `/groups/feed`,
            Icon: <Newspaper className='w-6 h-6 font-light' />
          },
          {
            title: 'discover',
            href: `/groups/discover`,
            Icon: <Radar className='w-6 h-6' />
          },
          {
            title: 'yourGroups',
            href: `/groups/your-groups`,
            Icon: <Users2Icon className='w-6 h-6' />
          },
          {
            title: 'joinedGroups',
            href: `/groups/joined-groups`,
            Icon: <Group className='w-6 h-6' />
          },
          {
            title: 'invitations',
            href: `/groups/invitations`,
            Icon: <UserPlus className='w-6 h-6' />
          },
        ]
      case 'events':
        return [
          {
            title: 'discover',
            href: `/events/discover`,
            Icon: <CalendarDays className='w-6 h-6 font-light' />
          },
          {
            title: 'yourEvents',
            href: `/events/your-events`,
            Icon: <User className='w-6 h-6' />
          },
          {
            title: 'birthdays',
            href: `/events/birthday`,
            Icon: <Cake className='w-6 h-6' />
          },
          {
            title: 'calendar',
            href: `/events/calendar`,
            Icon: <CalendarCheck2Icon className='w-6 h-6' />
          }
        ]
      default:
        return [
          {
            title: 'messages',
            href: `/messages`,
            Icon: <MessagesSquare className='w-6 h-6' />
          },
          {
            title: 'events',
            href: `/events/discover`,
            Icon: <CalendarDays className='w-6 h-6' />
          },
          {
            title: 'pages',
            href: `/pages/your-pages`,
            Icon: <Flag className='w-6 h-6' />
          },
          {
            title: 'groups',
            href: `/groups/your-groups`,
            Icon: <Users className='w-6 h-6' />
          },
          {
            title: 'feeds',
            href: '/',
            Icon: <Home className='w-6 h-6' />
          },
          {
            title: 'bookmark',
            href: `/bookmark`,
            Icon: <Bookmark className='w-6 h-6' />
          },
          {
            title: 'settings',
            href: `/settings`,
            Icon: <Cog className='w-6 h-6' />
          },
        ]
    }
  }
  
  export const EventCategories = [
    {
      title: 'classics',
      Icon: <Book className='w-4 h-4' />
    },
    {
      title: 'comedy',
      Icon: <Smile className='w-4 h-4' />
    },
    {
      title: 'crafts',
      Icon: <Scissors className='w-4 h-4' />
    },
    {
      title: 'fitness&workouts',
      Icon: <Dumbbell className='w-4 h-4' />
    },
    {
      title: 'food&Drink',
      Icon: <Utensils className='w-4 h-4' />
    },
    {
      title: 'games',
      Icon: <Gamepad2 className='w-4 h-4' />
    },
    {
      title: 'health&medical',
      Icon: <HeartPulse className='w-4 h-4' />
    },
    {
      title: 'home&garden',
      Icon: <Shovel className='w-4 h-4' />
    },
    {
      title: 'parties',
      Icon: <Cake className='w-4 h-4' />
    },
    {
      title: 'professionalNetworking',
      Icon: <Network className='w-4 h-4' />
    },
    {
      title: 'religions',
      Icon: <HelpingHand className='w-4 h-4' />
    },
    {
      title: 'shopping',
      Icon: <ShoppingCart className='w-4 h-4' />
    },
    {
      title: 'soicalIssues',
      Icon: <HeartHandshake className='w-4 h-4' />
    },
    {
      title: 'sports',
      Icon: <Bike className='w-4 h-4' />
    },
    {
      title: 'theatre',
      Icon: <Laugh className='w-4 h-4' />
    },
    {
      title: 'visualArts',
      Icon: <Tv className='w-4 h-4' />
    },
  ]
  
  