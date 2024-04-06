
import { type SSRprops } from '@faris/utils/ssr/ssrWrapper';
import { type GetServerSidePropsContext } from 'next';

import dynamic from 'next/dynamic';

const Layout = dynamic(()=>import('@faris/components/layout/Layout'))
const NotificationList = dynamic(()=>import('@faris/components/notification/NotificationList'))

export default function Notification(props:SSRprops) {

  return (
    <Layout {...props} className='w-full'>
      <NotificationList/>
    </Layout>
  )
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