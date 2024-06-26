import  { useEffect, useState } from 'react'
import StepCard from './StepCard'
import interestList from 'public/interestedList'
import { Button } from '../ui/button'
import { api } from '@faris/utils/api'
import { useTranslation } from 'next-i18next';import { type SubmitGetingStartThirdStep, submitGetingStartThirdStepSchema } from '@faris/server/module/gettingStart/gettingStart.schema'
import useSessionStore from 'zustandStore/userSessionStore'
import { parse } from 'valibot'
import { submitGetingStartThirdStepInitialValues } from '@faris/server/module/gettingStart/gettingStart.inital'
import NextStepButton from './NextStepButton'

export default function ThirdStep() {
    const [disabled,setDisabled] = useState(true)
    const {t} = useTranslation()
    const [data,setData] = useState<SubmitGetingStartThirdStep>(submitGetingStartThirdStepInitialValues)
    const id = useSessionStore(state=>state.user.id)

    const {mutate,isLoading} = api.gettingstart.submitThirdStep.useMutation({
        onSuccess(){
            // redirect to main page . . . 
            window.location.href = '/'
        }
    })

    useEffect(()=>{
        try{
            parse(submitGetingStartThirdStepSchema,data)
            setDisabled(false)
        }catch{
            setDisabled(true)
        } 
    },[data])

    useEffect(()=>{
        setData(prevs=>({...prevs,id}))
    },[id])


    const Topic = ({ topic }: { topic: string }) => {
        const { t } = useTranslation();
        const isChecked = data.interestedTopics.includes(topic);
      
        const onClickHandler = () => {
          if (isChecked) {
            setData((prevs) => ({
              ...prevs,
              interestedTopics: prevs.interestedTopics.filter((item) => item !== topic),
            }));
          } else {
            setData((prevs) => ({
              ...prevs,
              interestedTopics: [...prevs.interestedTopics, topic],
            }));
          }
        };
      
        return (
          <Button variant={"ghost"} onClick={onClickHandler} className={` ${isChecked ? "border" : ""}`}>
            {t(topic)}
          </Button>
        );
      };
      

    return (
        <StepCard title={'setYourInterest'} description='gettingStartStep3Notice1' step={3} onClick={() => true}>
            <ul className='flex gap-4 flex-wrap'>
            {interestList.map(topic=><Topic key={topic} topic={topic}/>)}
            </ul>
            <p className='text-sm opacity-70'>{t('gettingStartThirdStepNote')}</p>
            <NextStepButton buttonLabel='finish' isLoading={isLoading} disabled={disabled} onClick={()=>mutate(data)} />
        </StepCard>
    )
}