import { Alert } from "@faris/components/ui/alert"
import { Button } from "@faris/components/ui/button"
import { Card } from "@faris/components/ui/card"
import { Input } from "@faris/components/ui/input"
import { signUpSchema } from "@faris/server/module/auth/auth.schema"
import { api } from "@faris/utils/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import Loading from "../general/Loading"
import { parse } from "valibot"
import ReCAPTCHA from "react-google-recaptcha"
import { env } from "@faris/env.mjs"
import { Password } from "../ui/password"
export default function SignUpForm() {
  const { t } = useTranslation()
  const [isPassed,setIsPassed] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSucessAlert, setShowSuccessAlert] = useState(false)
  const { mutate,isLoading } = api.auth.signUp.useMutation({
    onError(error) {
      console.log(error.shape)
      error.data?.code == 'FORBIDDEN' ? setErrorMessage(t('emailIsAlreadyRegistered')) : true
      error.data?.code == 'INTERNAL_SERVER_ERROR' ? setErrorMessage(t('somethingWentWrong')) : true
    },
    onSuccess() {
      setShowSuccessAlert(true)
      setErrorMessage(null)
    }
  })
  const [credentials, SetCredentials] = useState({
    email: '',
    password: ''
  })

  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    try {
      parse(signUpSchema,credentials)
      setDisabled(false)
    } catch(err) {
      console.log(err)
      setDisabled(true)
    }
  }, [credentials])

  return <div className="w-full min-h-screen flex items-center justify-center px-2 sm:px-0">
    <Card className="w-full sm:w-3/4 lg:w-1/2 p-4 space-y-4 py-8">
    <h1 className="text-xl font-bold text-center opacity-70 py-4">{t('welcomeToPlatform')}</h1>
      <p className="text-center text-sm opacity-70">{t('signInQuotation')}</p>
      <Input value={credentials.email} onChange={(e) => SetCredentials((prevs) => ({ ...prevs, email: e.target.value }))} />
      <Password value={credentials.password} onChange={(e) => SetCredentials((prevs) => ({ ...prevs, password: e.target.value }))}/>
      <p className="text-xs">{t('passwordNotice')}</p>
      <ReCAPTCHA
          sitekey={env.NEXT_PUBLIC_RECAPCHA_SITEKEY}
          onChange={() => setIsPassed(true)}
        />
      <Button disabled={disabled || isLoading || !isPassed} onClick={() => mutate(credentials)} className="w-full">{isLoading ? <Loading withText={true}/>: t('signUp')}</Button>
      {errorMessage && <Alert variant={'destructive'}>{errorMessage}</Alert>}
      {showSucessAlert && <Alert className="text-xs">{t('registeredSuccessfully')}</Alert>}
      <div className="text-center">
        <h3>{t('alreadyHaveAccount')}</h3>
        <Link className='font-bold hover:text-primary hover:scale-105 transition-all duration-300 underline text-center' href={`/auth/sign-in`}>{t('signIn')}</Link>
      </div>
    </Card>
  </div>
}