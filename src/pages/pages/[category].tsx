import { type GetStaticPaths, type GetStaticProps } from 'next'
import { querySchema, pagesViews, type Category } from '@faris/server/module/page/page.schema';
import { safeParse } from 'valibot';

import dynamic from "next/dynamic";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Layout = dynamic(() => import('@faris/components/layout/Layout'))
const Discover = dynamic(() => import('@faris/components/pages/discover/Discover'))
const Invitations = dynamic(() => import('@faris/components/pages/invitations/Invitations'))
const LikedPages = dynamic(() => import('@faris/components/pages/likedPages/LikedPages'))
const YourPages = dynamic(() => import('@faris/components/pages/YourPages/YourPages'))
const CreateNewPageModel = dynamic(() => import('@faris/components/pages/CreateNewPageModel'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))


export default function Pages({ category }: { category: Category }) {
  
  const CurrentReview = ()=> {
    switch(category){
      case 'your-pages':
        return <YourPages/>
      case 'discover':
        return <Discover/>
      case 'liked-pages':
        return <LikedPages/>
      case 'invitations':
        return <Invitations/>
      default:
        return <YourPages/>
    }
  }

  return (
    <Layout type="pages" showRightMenu={false} className='max-w-5xl'>
      <div className="pb-20">
        {CurrentReview()}
      </div>
      <CreateNewPageModel />
             <SessionHelper/>


    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async(ctx) => {
  const params = safeParse(querySchema,ctx.params) 

  if (!params.success) return { notFound: true };

  return {
    props: {
      category: params.output.category,
      ...(await serverSideTranslations(ctx.locale??'en')),
    },
  };
};


export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: pagesViews.map((category) => ({
      params: { category },
    })),
    fallback: "blocking",
    
  };
};
