import { commonImageInitialValues } from "../common/common.initial"
import type { CreateNewPage, UpdateOnePage, UpdatePageIntroParams } from "./page.schema"

export const pageCoreInitialValues = {
    title:'',
    identifier:'',
    about:'',
    category:'',
}

export const createNewPageInitalValues = {
    ownerId:'',
    coverImage:commonImageInitialValues,
    profileImage:commonImageInitialValues,
    ...pageCoreInitialValues
} satisfies CreateNewPage

export const updateOnePageInitialValues = {
    id:'',
    coverImage:commonImageInitialValues,
    profileImage:commonImageInitialValues,
    ...pageCoreInitialValues
} satisfies UpdateOnePage

export const updatePageIntroInitialValues = {
    pageId:'',
    serviceArea:undefined,
    about:'',
    priceRange:undefined,
    services:[],
    website_url:undefined,
    email:undefined
} satisfies UpdatePageIntroParams