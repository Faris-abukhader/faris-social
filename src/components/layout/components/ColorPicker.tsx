import { Button } from '@faris/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { memo } from 'react';
import useColorSchemaStore from 'zustandStore/colorSchemaStore';

type color = 'light' | 'dark';

const ColorModeChanger = ()=> {
  const {colorSchema,setColorSchema} = useColorSchemaStore(state=>state)

  const clickHandler = (newColor:color)=> setColorSchema(newColor)

  return (
    <Button id='ColorModeChanger_button' size={'sm'} variant='ghost' onClick={()=>clickHandler(colorSchema=='dark'?'light':'dark')}>
      {colorSchema === 'dark' ? <Sun className='w-5 h-5'/> : <Moon className='w-5 h-5'/>}
      <label htmlFor='ColorModeChanger_button' className="sr-only mx-auto">notification dropdown button</label>
    </Button>
  );
}
export default memo(ColorModeChanger)