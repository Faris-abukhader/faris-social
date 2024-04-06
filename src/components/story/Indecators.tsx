import { Progress } from "../ui/progress";

export default function Indecators({total,current,value}:{total:number,current:number,value:number}) {
  return (
    <div className=' absolute left-0 top-2 w-full flex items-center gap-x-1 px-1'>
        {Array.from({length:total}).map((_,i)=><Progress  className="h-[2px]" key={i} value={current == i ? value : current > i ? 100 : 0}/>)}
    </div>
  )
}
