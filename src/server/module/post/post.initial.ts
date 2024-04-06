import type {CreateNewPost, ShareOnePost} from './post.schema'

export const postCoreInitialValues = {
    content:'',
    image:[],
    feeling:undefined,
    whoCanSee:undefined,
    mentionList:undefined,
    checkIn:undefined,
    hashtagList:[],
}

export const createNewPostInitialValues = {
    authorId:'',
    groupId:undefined,
    accountHolderId:'',
    holderType:'user',
    authorType:'user',
    ...postCoreInitialValues
} satisfies CreateNewPost

export const sharePostInitialValues = {
    postId:'',
    isResharedPost:false,
    authorId:'',
    accountHolderId:'',
    holderType:'user',
    ...postCoreInitialValues
} satisfies ShareOnePost

