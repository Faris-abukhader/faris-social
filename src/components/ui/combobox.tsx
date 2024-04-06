"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@faris/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@faris/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@faris/components/ui/popover"
import { useTranslation } from "next-i18next"
import { ScrollArea } from "./scroll-area"


export function Combobox({children,title}:{
    children?:React.ReactNode
    title:string
}) {
  const [open, setOpen] = React.useState(false)
  const {t} = useTranslation()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>
            {t('noSearchingResultFound')}
          </CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-40">
            {children}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
