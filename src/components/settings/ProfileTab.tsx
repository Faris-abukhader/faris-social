import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { useTranslation } from 'next-i18next';import { useForm } from 'react-hook-form'
import { type UpdateProfileSettingParams, updateProfileSettingSchema } from '@faris/server/module/profile/profile.schema'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { api } from '@faris/utils/api'
import { Button } from '../ui/button'
import { memo, useEffect, useState } from 'react'
import useSessionStore from 'zustandStore/userSessionStore'
import Loading from '../general/Loading'
import { updateProfileSettingInitialValues } from '@faris/server/module/profile/profile.initial'
import { useToast } from '../ui/use-toast'
import useLocalizationStore from 'zustandStore/localizationStore';

const ProfileTab = ()=> {
  const language = useLocalizationStore(state=>state.language)
  const { t } = useTranslation()
  const {toast} = useToast()
  const [dummy,setDummy] = useState(0)
  const {isReady,user} = useSessionStore(state=>state)
  const {mutate,isLoading} = api.profile.updateProfileSetting.useMutation({
    onSuccess() {
      toast({
        title: t('accountUpdatedSuccessfully'),
        description: t('actionNeedTime')
      })
    },
  })

  const { handleSubmit, setValue,getValues,reset, register, formState: { isValid } } = useForm({
    resolver: valibotResolver(updateProfileSettingSchema),
    defaultValues: updateProfileSettingInitialValues as UpdateProfileSettingParams
  })

  const submitHandler = (data:UpdateProfileSettingParams) =>mutate(data)

  useEffect(()=>{
    isReady && reset({id:user.id,fullName:user.fullName,bio:user.bio??undefined,isVisiable:user.isVisiable,isPrivate:user.isPrivate})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isReady])
  
return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form dir={language=='ar'?'rtl':'ltr'} onSubmit={handleSubmit(submitHandler)} className='grid grid-cols-1 space-y-10'>
      <Label className="space-y-3">
        <h3>{t('displayName')}</h3>
        <Input {...register('fullName')} />
        <h4 className="text-xs opacity-70 font-thin">{t('displayNameNotice')}</h4>
      </Label>
      <Label className="space-y-3">
        <h3>{t('bio')}</h3>
        <Textarea {...register('bio')} />
        <h4 className="text-xs opacity-70 font-thin">{t('bioNotice')}</h4>
      </Label>
      <div className='flex justify-between'>
        <div className='space-y-2'>
          <h1>{t('allowPeopleToFollowYou')}</h1>
          <p className='text-xs opacity-80 font-light'>{t('allowPeopleToFollowYouNotice')}</p>
        </div>
        <Switch checked={getValues('isPrivate')} onCheckedChange={(newValue)=>{setValue('isPrivate',newValue);setDummy(dummy+1)}}  />
      </div>
      <div className='flex justify-between'>
        <div className='space-y-2'>
          <h1>{t('contentVisibility')}</h1>
          <p className='text-xs opacity-80 font-light'>{t('contentVisibilityNotice')}</p>
        </div>
        <Switch checked={getValues('isVisiable')} onCheckedChange={(newValue)=>{setValue('isVisiable',newValue);setDummy(dummy+1)}}  />
      </div>
      <Button disabled={isLoading || !isValid} type='submit'>{isLoading?<Loading/>:t('confirm')}</Button>
    </form>
  )
}

export default memo(ProfileTab)
