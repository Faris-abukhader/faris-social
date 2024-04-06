import { eventQuerySchema } from "@faris/server/module/event/event.schema";
import { type GetStaticPaths, type GetStaticPropsContext } from "next";
import eventCategories from '@faris/utils/eventCategories';
import { safeParse } from "valibot";

import dynamic from "next/dynamic";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Layout = dynamic(() => import('@faris/components/layout/Layout'))
const EventList = dynamic(() => import('@faris/components/events/filteredEvent/EventList'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))

interface CategoryFilterProps{
  category:string
}

export default function CategoryFilter({category}:CategoryFilterProps) {
  return (
    <Layout type='events' showRightMenu={false} className=' max-w-6xl sm:px-4'>
        <EventList category={category}/>
        <SessionHelper/>
    </Layout>
  );
}

export const getStaticProps = async({params,locale}:GetStaticPropsContext) => {
  const category = safeParse(eventQuerySchema,params)

  if (!category.success) return { notFound: true };

  return {
    props: {
      category: category.output.category,
      ...(await serverSideTranslations(locale??'en')),
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: eventCategories.map((category) => ({
      params: { category },
    })),
    fallback: "blocking",
  };
};