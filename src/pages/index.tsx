import { type GetServerSidePropsContext } from 'next';
import { type SSRprops } from '@faris/utils/ssr/ssrWrapper';

import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('@faris/components/layout/Layout'),{ ssr: false })
const FeedPostList = dynamic(() => import('@faris/components/feed/FeedPostList'))
const StoryBar = dynamic(() => import('@faris/components/story/StoryBar'))

export default function Home(props: SSRprops) {

  return (
    <Layout{...props} className='w-full sm:w-full px-0 sm:px-0'>
      <StoryBar profileId={props.session?.id??'-1'} />
      <div className='mt-5 px-2 sm:px-8'>
        <FeedPostList/>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const { handleCommonServerSideProps } = await import('@faris/utils/ssr/handleCommonServerSideProps')

  // Call the common logic and include the specific data and redirect error Handling
  const commonProps = await handleCommonServerSideProps(ctx);

  if (commonProps?.redirect) return { ...commonProps }

  return {
    props: {
      ...commonProps?.props,
    }
  };
};