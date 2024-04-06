import { useEffect } from 'react';

interface DataEffectOptions<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any| undefined;
  currentPage: number;
  condition: boolean;
  currentTarget:string
  target: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadFunction:(newGroupList: any|[], pageNumber: number, target: T) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFunction:(data: any|[], pageNumber: number, target: T) => void;
}

export function useDataEffect<T>({
  data,
  currentPage,
  condition,
  target,
  currentTarget,
  loadFunction,
  setFunction,
}: DataEffectOptions<T>) {
  useEffect(() => {
    if (currentPage === 0 && condition) {
      return;
    }

    console.log({currentTarget,target})

    if (data) {
      if (target === currentTarget) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        loadFunction(data.data, data.pageNumber,target);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setFunction(data.data, data.pageNumber, target);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentPage, condition, target, loadFunction, setFunction]);
}