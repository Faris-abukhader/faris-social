  
  import { Button } from "@faris/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@faris/components/ui/dropdown-menu"
import { changeLanguage } from "i18next"
import { Check } from "lucide-react"
import { useRouter } from "next/router"
import langaugeList from "public/languageList"
import { useEffect, useState } from "react"
  
interface LanguageDropdownProps {
  onClick?:(language:string)=>void
}
export function LanguageDropdown({onClick}:LanguageDropdownProps) {
  const { locale, pathname, query, push } = useRouter()
  const [selectedLanguage,setSelectedLanguage] = useState(locale)

  useEffect(()=>{
    setSelectedLanguage(locale??'en')
    void changeLanguage(locale??'en')
  },[locale])

  const clickHandler = async(lang:string)=>{
      setSelectedLanguage(lang)
      void changeLanguage(lang)
      await push({ pathname, query: { id: query?.id } }, pathname, { locale: lang })
      onClick && onClick(lang)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedLanguage}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          {langaugeList.map((lang)=><DropdownMenuItem onClick={()=>void clickHandler(lang.code)} key={lang.id}>
            {selectedLanguage==lang.code&&<Check className="w-4 h-4 mx-2"/>}
            <span> {lang.flag}  ({lang.name})</span>
          </DropdownMenuItem>
          )}
          </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
  