import StepCard from "./StepCard";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useTranslation } from "next-i18next";
import { api } from "@faris/utils/api";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  type SubmitGetingStartFirstStep,
  submitGetingStartFirstStepSchema,
} from "@faris/server/module/gettingStart/gettingStart.schema";
import useSessionStore from "zustandStore/userSessionStore";
import { useEffect } from "react";
import { DatePicker } from "../general/DatePicker";
import { submitGetingStartFirstStepInitialValues } from "@faris/server/module/gettingStart/gettingStart.inital";
import NextStepButton from "./NextStepButton";

export default function FirstStep() {
  const { t } = useTranslation();
  const userId = useSessionStore((state) => state.user.id);
  const { mutate: submit, isLoading } =
    api.gettingstart.submitFirstStep.useMutation({
      onSuccess() {
        window.location.href = "/getting-start/2";
      },
    });

  const {
    handleSubmit,
    setValue,
    register,
    formState: { isValid },
  } = useForm({
    resolver: valibotResolver(submitGetingStartFirstStepSchema),
    defaultValues:
      submitGetingStartFirstStepInitialValues as SubmitGetingStartFirstStep,
  });

  useEffect(() => {
    setValue("id", userId);
  }, [userId, setValue]);

  const submitHandler = (data: SubmitGetingStartFirstStep) => submit(data);

  return (
    <StepCard
      title={"welcomeToPlatform"}
      description="gettingStartStep1Notice1"
      step={1}
      onClick={() => true}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(submitHandler)} className=" space-y-4">
        <div>
          <Label>{t("displayName")}</Label>
          <Input {...register("fullName")} />
        </div>
        <div>
          <Label>{t("bio")}</Label>
          <Input {...register("bio")} />
        </div>
        <DatePicker
          textPlaceholder={t("yourBirthday")}
          onChange={(date) => setValue("birthday", date)}
        />
        <NextStepButton isLoading={isLoading} disabled={!isValid} />
      </form>
    </StepCard>
  );
}