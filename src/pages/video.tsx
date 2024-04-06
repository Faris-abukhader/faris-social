import { useEffect, useState } from "react";
import { type GetServerSidePropsContext } from "next";
import 'swiper/css';
import { type SSRprops } from "@faris/utils/ssr/ssrWrapper";

import dynamic from "next/dynamic";

const Layout = dynamic(()=>import('@faris/components/video/Layout'))
const VideoCard = dynamic(()=>import('@faris/components/video/VideoCard'))
const Head = dynamic(()=>import('next/head'))
const Swiper = dynamic(()=>import('swiper/react').then(com=>com.Swiper))
const SwiperSlide = dynamic(()=>import('swiper/react').then(com=>com.SwiperSlide))

// this page to be implemented
// my initial plan was to support videos
// but every plan changes hhh 
export default function Video(props:SSRprops) {
  const [width,setWidth] = useState(0)

  useEffect(()=>{
    setWidth(window.innerHeight)
  },[])

  return (
    <>
      <Head>
        <title>Faris social</title>
        <meta name="description" content="Faris social media app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...props}>
       <Swiper
       className={`mb-20 ${!props.isMobile ?'mt-4':''}`}
       height={width}
       direction="vertical"
      spaceBetween={10}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <ul className={`${!props.isMobile ?'pt-4':''} space-y-3`}>
      {Array.from({length:10}).map((num,index)=>
       <SwiperSlide  className=" h-screen sm:max-h-[610px]" key={index}><VideoCard index={index}/></SwiperSlide>)}
      </ul>
    </Swiper>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const {handleCommonServerSideProps} = await import('@faris/utils/ssr/handleCommonServerSideProps')

  // Call the common logic and include the specific data and redirect error Handling
  const commonProps = await handleCommonServerSideProps(ctx);

  return {
    props:{
      ...commonProps?.props,
    }
  };
};