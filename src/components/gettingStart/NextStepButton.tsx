import { Button } from "../ui/button";
import { useTranslation } from "next-i18next";
import Loading from "../general/Loading";
import { ArrowRight } from "lucide-react";

const NextStepButton = ({
  disabled,
  isLoading,
  onClick,
  buttonLabel='nextStep',
}: {
  disabled: boolean;
  isLoading: boolean;
  onClick?:()=>void,
  buttonLabel?:string
}) => {
  const { t } = useTranslation();
  return (
    <Button disabled={disabled} onClick={()=>onClick &&onClick()} className="w-full">
      {isLoading ? (
        <Loading withText={true} />
      ) : (
        <>
          {t(buttonLabel)} <ArrowRight className="mx-2" size={20} />
        </>
      )}
    </Button>
  );
};

export default NextStepButton;
