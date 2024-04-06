import { commonImageInitialValues } from "../common/common.initial";
import type { UpdateProfile, UpdateProfileAccountSettingParams, UpdateProfileImage, UpdateProfileSettingParams } from "./profile.schema";

export const updateProfileInitialValues = {
    id:'',
    bio:'',
    livingLocation:'',
    fromLocation:'',
    status:'',
    fullName:''
} satisfies UpdateProfile

export const updateProfileImage = {
    id:'',
    image:commonImageInitialValues
} satisfies UpdateProfileImage

export const updateProfileAccountSettingInitialValues = {
    id:'',
    gender:'',
    livingLocation:undefined,
    contentLanguage:'',
    platformLanguage:'',
} satisfies UpdateProfileAccountSettingParams

export const updateProfileSettingInitialValues = {
    id:'',
    isVisiable:false,
    isPrivate:false,
    bio:undefined,
    fullName:'', 
} satisfies UpdateProfileSettingParams