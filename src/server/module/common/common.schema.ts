import {string,minLength,minValue,optional,number,array,nullable,object,type Output} from 'valibot'

export const commonInvitationSchema = object({
    senderId:string(),
    recievers:array(object({
        id:string()
    }))
})

export const commonPaginationSchema = object({
    page:number([minValue(0)]),
    range:number()
})

export const commonImageSchema = object({
    url:string([minLength(1)]),
    path:string([minLength(1)]),
    thumbnailUrl:string([minLength(1)]),
})

export const commonMiniUserSchema = object({
    id:string(),
    fullName:string(),
    image:nullable(object({
        url:string(),
        thumbnailUrl:string([minLength(1)]),
    }))
})

export const commonExpectedList = optional(array(object({
    id:string()
})))

const DEFAULT_PAGINATION = 25
export const enum PAGINATION {
    USERS = DEFAULT_PAGINATION,
    PAGES = DEFAULT_PAGINATION,
    GROUPS = DEFAULT_PAGINATION,
    EVENTS = DEFAULT_PAGINATION,
    COMMENTS = DEFAULT_PAGINATION,
    REPLIES = DEFAULT_PAGINATION,
    MESSAGES = DEFAULT_PAGINATION,
    CONVERSATIONS = DEFAULT_PAGINATION,
    POSTS = 15, 
    SEARCHRESULTS = DEFAULT_PAGINATION,
    NOTIFICATIONS = DEFAULT_PAGINATION,
    FOLLOWERS = 20,
    PHOTOS = 12,
    REVIEWS = 20,  
    CHECKINS = DEFAULT_PAGINATION,
    FRIENDS = 20,
    MINI = 6,
    STORY = DEFAULT_PAGINATION,
}

export const enum NOTIFICATION_TYPE {
    RECIEVE_FRIEND_REQUEST='RECIEVE_FRIEND_REQUEST',//
    ACCEPT_FRIEND_REQUEST='ACCEPT_FRIEND_REQUEST',//
    LIKE_PAGE='LIKE_PAGE',//
    INVITATION_FOR_LIKE_PAGE='INVITATION_FOR_LIKE_PAGE',//
    USER_JOINED_GROUP='USER_JOINED_GROUP',//
    INVITATION_FOR_JOIN_GROUP='INVITATION_FOR_JOIN_GROUP',//
    PUBLISH_POST_IN_YOUR_GROUP='PUBLISH_POST_IN_YOUR_GROUP',//
    REQUEST_TO_JOIN_GROUP='REQUEST_TO_JOIN_GROUP',//
    ACCEPT_JOIN_GROUP='ACCEPT_JOIN_GROUP',//
    USER_INTERESTED_IN_EVENT='USER_INTERESTED_IN_EVENT',//
    USER_GOING_TO_EVENT='USER_GOING_TO_EVENT',//
    INVITATION_FOR_EVENT='INVITATION_FOR_EVENT',//
    LIKE_POST='LIKE_POST',//
    LIKE_COMMENT='LIKE_COMMENT',//
    LIKE_REPLY='LIKE_REPLY',//
    LIKE_STORY='LIKE_STORY',
    WRITE_COMMENT='WRITE_COMMENT',//
    WRITE_REPLY='WRITE_COMMENT',//
    SHARE_YOUR_POST='SHARE_YOUR_POST',//
    SHARE_POST_IN_YOUR_PROFILE='SHARE_POST_IN_YOUR_PROFILE',//
    WRITE_PAGE_REVIEW='WRITE_PAGE_REVIEW',//
}

export const enum SCORE_SYSTEM {
    // when post got liked
    LIKE_POST=2,
    // when comment got liked 
    LIKE_COMMENT=2,
    // when reply got liked
    LIKE_REPLY=2,
    // when user like one page
    LIKE_PAGE=2,
    // when user publish a new post , when the post is toxic will be in negative value
    PUBLISH_POST=2,
    // when user's post got shared by other , post will have extra score
    SHARE_POST=2,
    // when user write a comment , when the comment was spam will be in negative value 
    WRITE_COMMENT=2,
    // when user write a reply , when the reply was spam will be in negative value
    WRITE_REPLY=2,
    // when user write a review , when the review was spam will be in negative value
    WRITE_REVIEW=2,
    // when user create a new page
    CREATE_PAGE=2,
    // when user create a new group
    CREATE_GROUP=2,
    // when user create a new event
    CREATE_EVENT=2,
    // when user attend an event , both user and event get the scores
    ATTEND_EVENT=2,
    // when user join a group
    JOIN_GROUP=2,
    // when two users became friends both of them will get it  
    ADD_FRIEND=2,
    // the user who got blocked lose the scores
    BLOCK_USER=2,
    // when user's post got saved by others
    FAVOURITE_POST=2,
    // user got extra score when he/she share new story
    SHARE_STORY=2,
    // the story get extra score if someone like it
    LIKE_STORY=2
}

export const enum STORAGE_FOLDER {
    PROFILE = 'profile',
    COVER  ='cover',
    STORY = 'story',
    POST = 'post'
}

export type MiniUser = Output<typeof commonMiniUserSchema>
export type CommonImageParams = Output<typeof commonImageSchema>