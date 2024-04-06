import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export function useQueryParam(paramName:string) {
  const { push, query } = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString())

  const set = (value:string) => {
    // Update the existing searchParams object
    newParams.set(paramName, value);

    void push({ query: { ...query, [paramName]: value } }, undefined, { shallow: true });
  };


  const remove = () => {
    // Remove the parameter from the searchParams object
    newParams.delete(paramName);

    // Remove the parameter from the query object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [paramName]:omitted, ...updatedQuery } = query;

    void push({ query: updatedQuery }, undefined, { shallow: true });
  };

  return { set,remove, value: newParams.get(paramName) };
}
