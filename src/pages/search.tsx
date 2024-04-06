import useSearch from 'zustandStore/searchStore';
import { type GetServerSidePropsContext } from 'next';
import { type SSRprops } from '@faris/utils/ssr/ssrWrapper';

import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('@faris/components/layout/Layout'))
const SearchingNavigator = dynamic(() => import('@faris/components/search/SearchingNavigator'))
const PeopleTap = dynamic(() => import('@faris/components/search/UserTap'))
const PagesTap = dynamic(() => import('@faris/components/search/PagesTab'))
const GroupsTap = dynamic(() => import('@faris/components/search/GroupTap'))
const HashtagTap = dynamic(() => import('@faris/components/search/HashtagTap'))


export default function Search(props:SSRprops) {
  const currentTap = useSearch(state => state.tap)

  const viewRender = () =>{
    switch(currentTap){
      case 'people':
        return <PeopleTap/>
      case 'pages':
        return <PagesTap/>
      case 'groups':
        return <GroupsTap/>
      case 'hashtag':
        return <HashtagTap/>
      default:
        return <PeopleTap/>
    }
  }

  return (
    <Layout {...props} showSearchingBar={false} className='w-full max-w-6xl px-0 sm:px-0'>
      <div className='w-full sm:border-r min-h-screen pb-20 px-2'>
        <SearchingNavigator />
        {viewRender()}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const {handleCommonServerSideProps} = await import('@faris/utils/ssr/handleCommonServerSideProps')

  // Additional logic specific to this page

  // Call the common logic and include the specific data and redirect error Handling
  const commonProps = await handleCommonServerSideProps(ctx);
  if(commonProps?.redirect)return {...commonProps}

  return {
    props:{
      ...commonProps?.props,
    }
  };
};