import { Button } from "@faris/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import countriesList from "public/countriesList"
import { ScrollArea } from "../ui/scroll-area"
import langaugeList from "public/languageList"
import { Label } from "../ui/label"
import { LanguageDropdown } from "../general/LanguageDropdown"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import useSessionStore from "zustandStore/userSessionStore"
import { api } from "@faris/utils/api"
import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { type UpdateProfileAccountSettingParams, updateProfileAccountSettingSchema } from "@faris/server/module/profile/profile.schema"
import Loading from "../general/Loading"
import { updateProfileAccountSettingInitialValues } from "@faris/server/module/profile/profile.initial"
import { useToast } from "../ui/use-toast"
import useLocalizationStore from "zustandStore/localizationStore"
import { changeLanguage } from "i18next"

const genderList = ['m'/* male */, 'f'/* female */]

export default function AccountTab() {
  const { t } = useTranslation()
  const language = useLocalizationStore(state=>state.language)
  const { toast } = useToast()
  const [dummy, setDummy] = useState(0)
  const { isReady, user } = useSessionStore(state => state)
  const { setLanguage } = useLocalizationStore(state => state)
  const { mutate, isLoading } = api.profile.updateAccountSetting.useMutation({
    onSuccess() {
      toast({
        title: t('accountUpdatedSuccessfully'),
        description: t('actionNeedTime')
      })
      setLanguage(getValues('platformLanguage'))
      void changeLanguage(getValues('platformLanguage'))
    },
  })

  const { handleSubmit, setValue, getValues, reset, formState: { isValid } } = useForm({
    resolver: valibotResolver(updateProfileAccountSettingSchema),
    defaultValues: updateProfileAccountSettingInitialValues as UpdateProfileAccountSettingParams
  })

  const submitHandler = (data: UpdateProfileAccountSettingParams) => mutate(data)

  useEffect(() => {
    isReady && reset({ id: user.id, gender: user.gender, contentLanguage: user.contentLanguage, platformLanguage: user.platformLanguage, livingLocation: user.livingLocation ?? undefined })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form dir={language=='ar'?'rtl':'ltr'} onSubmit={handleSubmit(submitHandler)} className="grid grid-cols-1 space-y-10">
      <Label className="space-y-3">
        <h3>{t('gender')}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{getValues('gender') ? t(getValues('gender')) : t('selectYourGender')}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {genderList.map(gender => <DropdownMenuItem key={gender} onClick={() => { setValue('gender', gender); setDummy(dummy + 1) }}>
              <span>{t(gender)}</span>
            </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <h4 className="text-xs opacity-70 font-thin">{t('genderImproveRecommendation')}</h4>
      </Label>
      <Label className="space-y-3">
        <h3>{t('country')}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{getValues('livingLocation') ? t(getValues('livingLocation') ?? '') : t('yourCountry')}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 max-h-40">
            <ScrollArea className="h-40 scrollbar-hide">
              <DropdownMenuGroup>
                {countriesList.map(country => <DropdownMenuItem key={country.id} onClick={() => { setValue('livingLocation', country.name); setDummy(dummy + 1) }}>
                  <span>{country.name}</span>
                </DropdownMenuItem>)}
              </DropdownMenuGroup>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <h4 className="text-xs opacity-70 font-thin">{t('thisPrimaryLocaiton')}</h4>
      </Label>
      <Label className="space-y-3">
        <h3>{t('contentLanguage')}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{getValues('contentLanguage') ? getValues('contentLanguage') : t('contentLanguage')}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 max-h-40">
            <ScrollArea className="h-40 scrollbar-hide">
              <DropdownMenuGroup>
                {langaugeList.map(language => <DropdownMenuItem key={language.id} onClick={() => { setValue('contentLanguage', language.code); setDummy(dummy + 1) }}>
                  <span>{language.code} . {language.name}</span>
                </DropdownMenuItem>)}
              </DropdownMenuGroup>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <h4 className="text-xs opacity-70 font-thin">{t('languageOfContentNotice')}</h4>
      </Label>
      <Label className="space-y-3">
        <h3>{t('platformLanguage')}</h3>
        <LanguageDropdown onClick={(language) => setValue('platformLanguage', language)} />
        <h4 className="text-xs opacity-70 font-thin">{t('chooseYourLanguageNotice')}</h4>
      </Label>
      <Button disabled={isLoading || !isValid}>{isLoading ? <Loading /> : t('confirm')}</Button>
    </form>
  )
}