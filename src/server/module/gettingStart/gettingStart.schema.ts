import { commonImageSchema } from '../common/common.schema'
import {string,date,array,nullable,object,type Output, maxLength, minLength} from 'valibot'

export const gettingStartFirstStepCore = {
    fullName:string([maxLength(120)]),
    bio:nullable(string([maxLength(250)]))
}

export const gettingStartRequestReturn = object({
    id:string(),
    gettingStart:string()
})

export const submitGetingStartFirstStepSchema = object({
    fullName:string([minLength(4),maxLength(120)]),
    bio:nullable(string([maxLength(250)])),
    id:string(),
    birthday:date(),
})

export const submitGetingStartSecondStepSchema = object({
    image:commonImageSchema,
    coverImage:commonImageSchema,
    id:string(),
})

export const submitGetingStartThirdStepSchema = object({
    id:string(),
    interestedTopics:array(string(),[minLength(5)])
})

export type SubmitGetingStartFirstStep = Output<typeof submitGetingStartFirstStepSchema>
export type SubmitGetingStartSecondStep = Output<typeof submitGetingStartSecondStepSchema>
export type SubmitGetingStartThirdStep = Output<typeof submitGetingStartThirdStepSchema>
