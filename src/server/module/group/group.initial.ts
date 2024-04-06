import { commonImageInitialValues } from "../common/common.initial"
import { postCoreInitialValues } from "../post/post.initial"
import type { UpdateOneGroup, CreateNewGroup, UpdateGroupIntroParams, CreateNewGroupPostParams } from "./group.schema"

export const groupCoreInitialValues = {
    title:'',
    rules:'',
    location:null,
    category:'',
    about:'',
    isPrivate:false,
    isVisiable:false,
    ownerId:'',
}

export const createNewGroupInitialValues = {
    coverImage:commonImageInitialValues,
    profileImage:commonImageInitialValues,
    ...groupCoreInitialValues,
} satisfies CreateNewGroup


export const updateGroupInitialValues = {
    id:'',
    coverImage:commonImageInitialValues,
    profileImage:commonImageInitialValues,
    ...groupCoreInitialValues,
} satisfies UpdateOneGroup

export const updateGroupIntroInitialValues = {
    id:'',
    ...groupCoreInitialValues,
} satisfies UpdateGroupIntroParams


export const createNewGroupPostInitialValues = {
    authorId:'',
    groupId:'',
    ...postCoreInitialValues
} satisfies CreateNewGroupPostParams
