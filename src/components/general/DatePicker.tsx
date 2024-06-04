import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@faris/utils/tailwindHelper"
import { Button } from "@faris/components/ui/button"
import { Calendar } from "@faris/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@faris/components/ui/popover"
import { useEffect, useState } from "react"

interface DatePickerProps {
  textPlaceholder:string
  onChange?:(newDate:Date)=>void
  date?:Date
}


type DateFormatReplacements = {
  [key: string]: string;
};

const pad = (number: number): string => number.toString().padStart(2, '0');

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const formatDate = (date: Date, formatStr: string): string => {
  const replacements: DateFormatReplacements = {
    'yyyy': date.getFullYear().toString(),
    'MM': pad(date.getMonth() + 1),
    'dd': pad(date.getDate()),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
    'PPP': `${dayNames[date.getDay()]??''}, ${monthNames[date.getMonth()]??''} ${pad(date.getDate())}, ${date.getFullYear()}`
  };

  return formatStr.replace(/yyyy|MM|dd|HH|mm|ss|PPP/g, (match) => replacements[match]??'');
};


export function DatePicker({textPlaceholder,onChange,date:initialDate}:DatePickerProps) {
  const [date, setDate] = useState<Date>()

  useEffect(()=>{
    initialDate && setDate(initialDate)
  },[initialDate])

  useEffect(()=>{
    (date && onChange) && onChange(date)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date, "PPP") : <span className=" capitalize">{textPlaceholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
