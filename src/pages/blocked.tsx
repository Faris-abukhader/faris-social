
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic"

const BlockContainer = dynamic(()=>import("@faris/components/blocked/BlockContainer"))

export default function Block() {
  return <BlockContainer/>
}


export const getStaticProps: GetStaticProps = async() => {
  return {
    props: {
      ...(await serverSideTranslations('en')),
    },
  };
};