"use client";

import React, { useState } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { UpdateRegisterValidation } from "@/lib/validation";
import { ArrowUpRight } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { postData } from "@/actions/post";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const RegisterValidation = UpdateRegisterValidation();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      phone: "",
      password: "",
      name: "",
      privacy_policy: false,
    },
  });

  const onSubmit = async (values) => {
    if (!values.privacy_policy) {
      return toast.error("Илтимос фойдаланиш шартларига розилик билдиринг!!!");
    }
    setIsLoading(true);
    try {
      const { privacy_policy, ...registerData } = values;
      const data = { ...registerData, bonus: 0, rassika_id: 0 };

      const response = await postData(data, "/api/users", "user");
      if (response.error) {
        return toast.error(response.error);
      } else if (response?.phone) {
        const expires = new Date();
        expires.setTime(expires.getTime() + 3 * 24 * 60 * 60 * 1000);
        Cookies.set("auth", JSON.stringify(response), {
          expires,
          path: "/",
        });
        toast.success("Сиз рўйхатдан ўтдингиз!");
        form.reset();
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 sm:space-y-4 rounded-md"
      >
        <div className="w-full flex flex-col gap-3 lg:gap-6">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            label="Исм"
            name="name"
            placeholder=""
            inputClass="rounded-md border-[2px]"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            label="Телефон рақами"
            name="phone"
            placeholder=""
            inputClass="rounded-md border-[1px]"
          />
          <CustomFormField
            label="Пароль"
            fieldType={FormFieldType.PASSWORDINPUT}
            control={form.control}
            name="password"
            placeholder=""
            inputClass="rounded-md border-[2px]"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              onCheckedChange={() =>
                form.setValue(
                  "privacy_policy",
                  !form.getValues("privacy_policy")
                )
              }
            />
            <h1
              className="text-white textSmall2 cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              Аккаунт очиш билан мен{" "}
              <span className="underline">Фойдаланиш шартлари</span> ва
              махфийлик сийосатига розилик билдираман
            </h1>
          </div>
        </div>
        <SubmitButton
          isLoading={isLoading}
          className="w-full sm:w-40 bg-white hover:bg-white text-black"
        >
          Юбориш
        </SubmitButton>
      </form>

      {/* ShadCN Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          mark="false"
          className="w-11/12 rounded-md max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Фойдаланиш шартлари</DialogTitle>
            <DialogDescription className="hidden">dfasf</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-700">
            <h2 className="font-semibold text-lg">1. Кириш</h2>
            <p>
              Ушбу веб-сайтга киришингиз ва ундан фойдаланишингиз шу ерда
              кўрсатилган шартларга розилик билдиришингизни англатади. Агар сиз
              ушбу шартларга рози бўлмасангиз, илтимос, сайтдан фойдаланманг.
            </p>

            <h2 className="font-semibold text-lg">
              2. Фойдаланувчи мажбуриятлари
            </h2>
            <p>
              Сиз ушбу хизматдан қонунга мувофиқ ва ахлоқ меъёрларига мос
              равишда фойдаланишингиз керак. Қуйидагилар тақиқланади:
            </p>
            <ul className="list-disc ml-5">
              <li>Қонунга зид ёки ноқонуний фаолият олиб бориш;</li>
              <li>
                Бошқа фойдаланувчиларни хафа қилиш, таҳқирлаш ёки шаънига путур
                етказиш;
              </li>
              <li>Ҳар қандай турдаги спам ёки зарарли дастурларни тарқатиш;</li>
              <li>
                Бошқа шахсларнинг шахсий маълумотларини рухсатсиз тўплаш ва
                фойдаланиш.
              </li>
            </ul>

            <h2 className="font-semibold text-lg">3. Хизматнинг чекловлари</h2>
            <p>
              Администраторлар хизматнинг фаолиятини таъминлаш мақсадида ушбу
              шартларни бузган фойдаланувчиларни огоҳлантириш, блоклаш ёки
              аккаунтини ўчириш ҳуқуқига эга.
            </p>

            <h2 className="font-semibold text-lg">
              4. Маълумотларни муҳофаза қилиш
            </h2>
            <p>
              Биз сиз берган шахсий маълумотларни ҳимоя қилишга ҳаракат қиламиз.
              Бизнинг <span className="underline">Махфийлик сиёсати</span>{" "}
              бўлимида бу ҳақда батафсил маълумот берилган.
            </p>

            <h2 className="font-semibold text-lg">
              5. Ҳуқуқлар ва жавобгарлик
            </h2>
            <p>
              Хизматдаги маълумотлар ҳар қандай вақтда ўзгартирилиши,
              тўхтатилиши ёки бекор қилиниши мумкин. Биз фойдаланувчиларнинг
              сайтдан нотўғри фойдаланиши натижасида келиб чиқадиган зарарлар
              учун жавобгар эмасмиз.
            </p>

            <h2 className="font-semibold text-lg">6. Ўзгаришлар</h2>
            <p>
              Биз ушбу шартларни вақти-вақти билан ўзгартириш ҳуқуқига эгамиз.
              Барча ўзгаришлар сайтда эълон қилинган вақтдан бошлаб амалга
              киритилади.
            </p>
          </div>
          <DialogFooter className={""}>
            <Button
              className=""
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >
              Бекор қилиш
            </Button>
            <Button
              className="hover:bg-primary"
              onClick={() => {
                form.setValue("privacy_policy", true);
                setIsDialogOpen(false);
              }}
            >
              ОК
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
