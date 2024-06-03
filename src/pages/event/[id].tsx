import { type TGetOneEvent, getOneEventHandler } from '@faris/server/module/event/event.handler';
import { type GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import dynamic from "next/dynamic";

const EventComponent = dynamic(() => import('@faris/components/event/EventComponent'))
const Layout = dynamic(() => import('@faris/components/layout/Layout'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))

interface EventPageProps {
  event:TGetOneEvent
}

export default function EventPage({event}:EventPageProps) {
  return (
    <Layout showLeftMenu={false} showRightMenu={false}>
      <EventComponent event={event}/>
             <SessionHelper/>
    </Layout>
  );
}

export async function getStaticProps({params,locale}:GetStaticPropsContext) {
  
  let event = await getOneEventHandler({eventId:String(params?.id)})

  event = JSON.parse(JSON.stringify(event)) as TGetOneEvent
  
  return {
    props: {
      event,
      ...(await serverSideTranslations(locale??'en')),
    },
    revalidate: 60 * 5, // 5 mins to re-validate
  }
}

export async function getStaticPaths() {

  const { prisma } = await import('@faris/server/db');

  // take first 100 events
  const events = await prisma.event.findMany({
    take:100,
    orderBy:{
      createdAt:'asc'
    },
    select:{
      id:true,
    }
  })
 
  // Get the paths we want to pre-render
  const paths = events.map((user) => ({
    params: { id: user.id },
  }))
 
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}