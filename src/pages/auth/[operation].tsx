import { type GetStaticPaths, type GetStaticProps } from 'next'
import { type Operation,validOperation,querySchema } from '@faris/server/module/auth/auth.schema';
import { safeParse } from 'valibot';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import dynamic from "next/dynamic";

const SignInForm = dynamic(()=>import('@faris/components/auth/SignInForm'))
const SignUpForm = dynamic(()=>import('@faris/components/auth/SignUpForm'))

import {prisma} from '@faris/server/db'
import bcrypt from 'bcrypt'

export default function AuthPage({ operation }: { operation: Operation }) {

    switch(operation){
      case 'sign-in':
        return <SignInForm/>
      case 'sign-up':
        return <SignUpForm/>
      default:
        return <SignInForm/>
    }
}


export const getStaticProps: GetStaticProps = async(ctx) => {
  const params = safeParse(querySchema,ctx.params)

  if (!params.success) return { notFound: true };

  // const hash = bcrypt.hashSync("Fares_455", 12);

  // await prisma.user.update({
  //   where:{
  //     id:'clptkcroe0000ei0v77srzt8l'
  //   },
  //   data:{
  //     password:hash
  //   }
  // })

  return {
    props: {
      operation: params.output.operation,
      ...(await serverSideTranslations(ctx.locale??'en')),
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: validOperation.map((operation) => ({
      params: { operation },
    })),
    fallback: "blocking",
  };
};
