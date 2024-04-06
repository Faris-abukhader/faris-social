import { Alert } from "@faris/components/ui/alert";
import { Button } from "@faris/components/ui/button";
import { Card } from "@faris/components/ui/card";
import { Input } from "@faris/components/ui/input";
import { signInSchema } from "@faris/server/module/auth/auth.schema";
import { api } from "@faris/utils/api";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Loading from "../general/Loading";
import { parse } from "valibot";
import ReCAPTCHA from "react-google-recaptcha";
import { env } from "@faris/env.mjs";
import { Password } from "../ui/password";
import SessionHelper from "../general/SessionHelper";
import useLocalizationStore from "zustandStore/localizationStore";

export default function SignInForm() {
  const { t } = useTranslation();
  const language = useLocalizationStore(state=>state.language)
  const [isPassed, setIsPassed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate, isLoading } = api.auth.signIn.useMutation({
    onSuccess() {
      // redirect to the main page
      window.location.href = "/";
    },
    onError(error) {
      console.log(error);
      error.data?.code == "NOT_FOUND"
        ? setErrorMessage(t("emailIsNoRegistered"))
        : true;
      error.data?.code == "UNAUTHORIZED"
        ? setErrorMessage(t("passwordIsNotCorrect"))
        : true;
      error.data?.code == "FORBIDDEN"
        ? setErrorMessage(t("yourEmailIsNotVerified"))
        : true;
      error.data?.code == "INTERNAL_SERVER_ERROR"
        ? setErrorMessage(t("somethingWentWrong"))
        : true;
    },
  });
  const [credentials, SetCredentials] = useState({
    email: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    try {
      parse(signInSchema, credentials);
      setDisabled(false);
    } catch {
      setDisabled(true);
    }
  }, [credentials]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-2 sm:px-0">
      <SessionHelper/>
      <Card className="w-full space-y-4 p-4 py-8 sm:w-3/4 lg:w-1/2">
        <h1 className="py-4 text-center text-xl font-bold opacity-70">
          {t("welcomeToPlatform")}
        </h1>
        <p className="text-center text-sm opacity-70">{t("signInQuotation")}</p>
        <Input
          placeholder={t("emailPlaceHolder")}
          value={credentials.email}
          onChange={(e) =>
            SetCredentials((prevs) => ({ ...prevs, email: e.target.value }))
          }
        />
        <Password
          placeholder={t("passwordPlaceHolder")}
          value={credentials.password}
          onChange={(e) =>
            SetCredentials((prevs) => ({ ...prevs, password: e.target.value }))
          }
        />
        <ReCAPTCHA
          lang={language}
          sitekey={env.NEXT_PUBLIC_RECAPCHA_SITEKEY}
          onChange={() => setIsPassed(true)}
        />
        <Button
          disabled={disabled || isLoading || !isPassed}
          onClick={() => mutate(credentials)}
          className="w-full"
        >
          {isLoading ? <Loading withText={true} /> : t("signIn")}
        </Button>
        {errorMessage && <Alert variant={"destructive"}>{errorMessage}</Alert>}
        <div className="text-center">
          <h3 className="text-center">{t("doNotHaveAccount")}</h3>
          <Link
            className="text-center font-bold underline transition-all duration-300 hover:scale-105"
            href={`/sign-up`}
          >
            {t("signUp")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
