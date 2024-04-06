import { commonImageInitialValues } from '../common/common.initial'
import type { SubmitGetingStartSecondStep, SubmitGetingStartFirstStep, SubmitGetingStartThirdStep} from  './gettingStart.schema'

export const submitGetingStartFirstStepInitialValues = {
    fullName:'',
    bio:null,
    id:'',
    birthday: new Date(),
} satisfies SubmitGetingStartFirstStep

export const submitGetingStartSecondStepInitialValues = {
    id:'',
    image:commonImageInitialValues,
    coverImage:commonImageInitialValues
} satisfies SubmitGetingStartSecondStep

export const submitGetingStartThirdStepInitialValues = {
    id:'',
    interestedTopics:[],
} satisfies SubmitGetingStartThirdStep