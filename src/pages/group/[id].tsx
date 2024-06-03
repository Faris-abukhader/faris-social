import { type TGetOneFullGroup, getFullOneGroupHandler } from '@faris/server/module/group/group.handler';
import { type GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import dynamic from "next/dynamic";

const GroupContent = dynamic(() => import('@faris/components/group/GroupContent'))
const GroupHeader = dynamic(() => import('@faris/components/group/GroupHeader'))
const Layout = dynamic(() => import('@faris/components/layout/Layout'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))

interface GroupProps {
  group:TGetOneFullGroup
}
export default function Group({group}:GroupProps) {

  return (
    <Layout showLeftMenu={false} showRightMenu={false} className='max-w-5xl'>
      <GroupHeader {...group} />
      <GroupContent group={group} />
             <SessionHelper/>


    </Layout>
  );
}

export async function getStaticProps({params,locale}:GetStaticPropsContext) {
  
  let group = await getFullOneGroupHandler({groupId:String(params?.id),requesterId:undefined})

  group = JSON.parse(JSON.stringify(group)) as TGetOneFullGroup


  return {
    props: {
      group,
      ...(await serverSideTranslations(locale??'en')),
    },
    revalidate: 60 * 5, // 5 mins to re-validate
  }
}

export async function getStaticPaths() {

  const { prisma } = await import('@faris/server/db');

  // take first 100 groups
  const groups = await prisma.group.findMany({
    take:100,
    orderBy:{
      createdAt:'asc'
    },
    select:{
      id:true,
    }
  })
 
  // Get the paths we want to pre-render
  const paths = groups.map((user) => ({
    params: { id: user.id },
  }))
 
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render groups
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}