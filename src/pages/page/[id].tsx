import { type TGetOneFullPage, getFullOnePageHandler } from '@faris/server/module/page/page.handler';
import { type GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import dynamic from "next/dynamic";

const Layout = dynamic(()=>import('@faris/components/layout/Layout'))
const PageContent = dynamic(()=>import('@faris/components/page/PageContent'))
const PageHeader = dynamic(()=>import('@faris/components/page/PageHeader'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))

interface PageProps {
  page:TGetOneFullPage
}

export default function Page({page}:PageProps) {

  return (
    <Layout showLeftMenu={false} showRightMenu={false} className='max-w-5xl'>
        <PageHeader {...page}/>
        <PageContent page={page}/>
               <SessionHelper/>


    </Layout>
  )
}

export async function getStaticProps({params,locale}:GetStaticPropsContext) {
  
  console.log()
  let page = await getFullOnePageHandler({pageId:String(params?.id),requesterId:undefined})
  page = JSON.parse(JSON.stringify(page)) as TGetOneFullPage

  return {
    props: {
      page,
      ...(await serverSideTranslations(locale??'en')),
    },
    revalidate: 60 * 5, // 5 mins to re-validate
  }
}

export async function getStaticPaths() {

  const { prisma } = await import('@faris/server/db');

  // take first 100 pages
  const pages = await prisma.page.findMany({
    take:100,
    orderBy:{
      createdAt:'asc'
    },
    select:{
      id:true,
    }
  })
 
  // Get the paths we want to pre-render
  const paths = pages.map((user) => ({
    params: { id: user.id },
  }))
 
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}