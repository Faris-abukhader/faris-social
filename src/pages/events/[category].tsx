import { type GetStaticPaths, type GetStaticProps } from 'next'
import { type Category,validCategories,querySchema } from '@faris/server/module/event/event.schema';
import { safeParse } from 'valibot';

import dynamic from "next/dynamic";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Layout = dynamic(() => import('@faris/components/layout/Layout'))
const BirthdayEvents = dynamic(() => import('@faris/components/events/birthday/BirthdayEvents'))
const DiscoverEvents = dynamic(() => import('@faris/components/events/discover/Discover'))
const YourEvent = dynamic(() => import('@faris/components/events/yourEvent/YourEvent'))
const Calendar = dynamic(() => import('@faris/components/events/calendar/Calendar'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))

export default function Groups({ category }: { category: Category }) {

  const CurrentReview = ()=> {
    switch(category){
      case 'your-events':
        return <YourEvent/>
      case 'discover':
        return <DiscoverEvents/>
      case 'birthday':
        return <BirthdayEvents/>
      case 'calendar':
        return <Calendar/>
      default:
        return <YourEvent/>
    }
  } 

  return (
    <Layout type='events' showRightMenu={false} className=' max-w-5xl'>
      {CurrentReview()}
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
    paths: validCategories.map((category) => ({
      params: { category },
    })),
    fallback: "blocking",
  };
};
