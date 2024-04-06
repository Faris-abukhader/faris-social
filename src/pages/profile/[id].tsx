import { prisma } from '@faris/server/db';
import { type GetOneProfile, getOneProfileHandler } from '@faris/server/module/profile/profile.handler';
import { type GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import dynamic from 'next/dynamic'

const Layout = dynamic(()=>import('@faris/components/layout/Layout'))
const ProfileContents = dynamic(()=>import('@faris/components/profile/ProfileContents'))
const ProfileHeader = dynamic(()=>import('@faris/components/profile/ProfileHeader'))
const SessionHelper = dynamic(() => import('@faris/components/general/SessionHelper'))

interface ProfileProps {
  profile:GetOneProfile
}

export default function Profile({profile}:ProfileProps) {
  return (
    <Layout showLeftMenu={false} showRightMenu={false} className='max-w-5xl'>
      <div className='pb-20'>
        <ProfileHeader {...profile} />
        <ProfileContents {...profile}/>
        </div>
        <SessionHelper />
    </Layout>
  )
}

export async function getStaticProps({params,locale}:GetStaticPropsContext) {
  
  const profile = await getOneProfileHandler(String(params?.id))
   
  return {
    props: {
      profile,
        ...(await serverSideTranslations(locale??'en')),
        // Will be passed to the page component as props
    },
    revalidate: 60 * 5, // 5 mins to re-validate,
  }
}

export async function getStaticPaths() {

  // take first 1K user
  const users = await prisma.user.findMany({
    take:1000,
    orderBy:{
      createdAt:'asc'
    },
    select:{
      id:true,
    }
  })
 
  // Get the paths we want to pre-render based on posts
  const paths = users.map((user) => ({
    params: { id: user.id },
  }))
 
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}