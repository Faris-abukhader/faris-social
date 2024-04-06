import { Button } from '@faris/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { memo } from 'react';
import useColorSchemaStore from 'zustandStore/colorSchemaStore';

type color = 'light' | 'dark';

const ColorModeChanger = ()=> {
  const {colorSchema,setColorSchema} = useColorSchemaStore(state=>state)

  const clickHandler = (newColor:color)=> setColorSchema(newColor)

  return (
    <Button size={'sm'} variant='ghost' onClick={()=>clickHandler(colorSchema=='dark'?'light':'dark')}>
      {colorSchema === 'dark' ? <Sun className='w-5 h-5'/> : <Moon className='w-5 h-5'/>}
    </Button>
  );
}
export default memo(ColorModeChanger)