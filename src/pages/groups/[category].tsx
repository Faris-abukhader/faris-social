import { pagesViews, querySchema } from '@faris/server/module/group/group.schema';
import { type GetStaticPaths, type GetStaticProps } from 'next'
import { safeParse } from 'valibot';

import dynamic from "next/dynamic";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Layout = dynamic(() => import('@faris/components/layout/Layout'))
const Discover = dynamic(() => import('@faris/components/groups/discover/Discover'))
const YourGroups = dynamic(() => import('@faris/components/groups/youGroups/YourGroups'))
const Feed = dynamic(() => import('@faris/components/groups/Feed'))
const Invitations = dynamic(() => import('@faris/components/groups/invitations/Invitations'))
const CreateNewGroupModel = dynamic(() => import('@faris/components/groups/CreateNewGroupModel'))
const JoinedGroups = dynamic(() => import('@faris/components/groups/joinedGroups/JoinedGroups'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))

export default function Groups({ category }: { category: string }) {

  const CurrentReview = ()=> {
    switch(category){
      case 'your-groups':
        return <YourGroups/>
      case 'discover':
        return <Discover/>
      case 'feed':
        return <Feed/>
      case 'invitations':
        return <Invitations/>
      case 'joined-groups':
        return <JoinedGroups/>
      default:
        return <YourGroups/>
    }
  }
  return (
    <Layout type="groups" showRightMenu={category=='feed'?true:false}>
      <div className="w-full b-20">
        {CurrentReview()}
      </div>
      <CreateNewGroupModel/>
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