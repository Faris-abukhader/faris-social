import StepCard from './StepCard'
import ProfileUploader from './ProfileUploader';
import CoverUploader from './CoverUploader';
import { useEffect, useState } from 'react';
import { api } from '@faris/utils/api';
import { type SubmitGetingStartSecondStep, submitGetingStartSecondStepSchema } from '@faris/server/module/gettingStart/gettingStart.schema';
import useSessionStore from 'zustandStore/userSessionStore';
import { parse } from 'valibot';
import { submitGetingStartSecondStepInitialValues } from '@faris/server/module/gettingStart/gettingStart.inital';
import NextStepButton from './NextStepButton';


export type ImageType = {
    path:string,
    url:string,
    thumbnailUrl: string   
}
export default function SecondStep() {
    const id = useSessionStore(state=>state.user.id)
    const [disabled,setDisabled] = useState(true)
    const [data,setData] = useState<SubmitGetingStartSecondStep>(submitGetingStartSecondStepInitialValues)


    const {mutate,isLoading} = api.gettingstart.submitSecondStep.useMutation({
        onSuccess(){
            // redirect
            window.location.href = `/getting-start/3`
        }
    })

    // validate the state and disabled the button 
    useEffect(()=>{
        try{
            parse(submitGetingStartSecondStepSchema,data)
            setDisabled(false)
        }catch(err){
            setDisabled(true)
        }
    },[data])

    // attaching the id into data state when session is loaded
    useEffect(()=>{
        setData((prevs)=>({...prevs,id}))
    },[id])

    // function will be passed to child component to update the state
    const setImage = (newImage:ImageType)=>{
        setData((prevs)=>({...prevs,image:newImage}))
    }

    const setCoverImage = (newImage:ImageType)=>{
        setData((prevs)=>({...prevs,coverImage:newImage}))
    }


    return (
        <StepCard title={'uploadYourImage'} description='gettingStartStep2Notice1' step={2} onClick={() => true}>
           <ProfileUploader setImage={setImage}/>
           <CoverUploader setCoverImage={setCoverImage} coverImage={data.coverImage.url}/>
           <NextStepButton onClick={()=>void mutate(data)} isLoading={isLoading}  disabled={disabled}/>
        </StepCard>
    )
}