import { Button } from "@faris/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function BlockContainer() {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className=" space-y-5 px-5 text-center">
        <Image
          className="mx-auto"
          width={400}
          height={400}
          src={`/illustrations/limitExceeded.svg`}
          alt="limit_exceeded_svg"
        />
        <h2 className="text-2xl font-bold">{t("rateLimitExceeded")}</h2>
        <p className=" w-full max-w-md">{t("rateLimitDescription")}</p>
        <Button>
          <Link href={`/`}>{t("goToHomePage")}</Link>
        </Button>
      </div>
    </div>
  );
}
