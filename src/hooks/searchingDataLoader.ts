import { useEffect } from 'react';
import { type SearchingType } from 'zustandStore/searchingStore';

export type Procedure = 'set'|'load'|'none'

interface DataEffectOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any| undefined;
  currentPage: number;
  condition: boolean;
  target: SearchingType;
  procedure:Procedure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFunction:(newData: any|[], pageNumber: number, target: SearchingType) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadFunction:(newData: any|[], pageNumber: number,target: SearchingType) => void
}

export function useSearchingDataLoader({
  data,
  currentPage,
  condition,
  target,
  setFunction,
  loadFunction,
  procedure
}: DataEffectOptions) {
  useEffect(() => {

    if (currentPage == 0 && condition || !data) return;

    switch(procedure){
      case 'set':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        return setFunction(data.data, data.pageNumber,target);
      case 'load':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        return loadFunction(data.data,data.pageNumber,target);
      default:
        console.log('do do anything')
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentPage, condition, target,procedure, setFunction]);
}