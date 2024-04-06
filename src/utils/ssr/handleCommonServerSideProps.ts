import { type GetServerSidePropsContext } from "next";
import { RedirectException } from "./redirectException";
import {ssrWrapper} from './ssrWrapper'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const handleCommonServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
  
      const data = await ssrWrapper(ctx);
  
      return {
        props: {
          ...data,
          ...(await serverSideTranslations(ctx.locale??'en')),
    
        },
      };
    } catch (error) {
      if (error instanceof RedirectException) {
        return {
          redirect: {
            destination: error.destination,
            permanent: false,
          },
        };
      }
    }
  };
  
  