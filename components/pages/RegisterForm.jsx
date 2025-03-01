"use client";

import React, { useState, useEffect } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UpdateRegisterValidation } from "@/lib/validation";
import { ArrowUpRight, Dot } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
export default function RegisterForm() {
  const RegisterValidation = UpdateRegisterValidation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      phone: "",
      password: "",
      name: "",
      privacy_policy: false,
    },
  });

  const onSubmit = async (values) => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 sm:space-y-4 w-ful rounded-md"
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
          <div className="w-full space-y-2">
            <CustomFormField
              label="Пароль"
              fieldType={FormFieldType.PASSWORDINPUT}
              control={form.control}
              name="password"
              placeholder=""
              inputClass="rounded-md border-[2px] focus:ring-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              onCheckedChange={() =>
                form.setValue(
                  "privacy_policy",
                  !form.getValues("privacy_policy")
                )
              }
            />
            <h1 className="text-white textSmall2">
              Аккаунт очиш билан мен Фойдаланиш шартлари ва махфийлик сийосатига
              розилик билдираман
            </h1>
          </div>
        </div>
        <div className="flex w-full max-sm:flex-col items-center sm:justify-start gap-3 sm:items-center">
          <SubmitButton
            isLoading={isLoading}
            className="w-full sm:w-40 bg-white hover:bg-white"
          >
            Юборищ
          </SubmitButton>
          <div className="sm:hidden w-full text-white flex items-center justify-center gap-2">
            <div className="w-full h-[1.5px] bg-white" />
            <h1 className="textNormal3">Йоки</h1>
            <div className="w-full h-[1.5px] bg-white" />
          </div>
          <div>
            <h1 className="max-sm:hidden text-[13px] text-white font-[400]">
              Аллақачон аккаунт бор
              <Link href={`/login`} className="hover:underline font-bold ">
                {" Кириш"}
              </Link>
            </h1>
          </div>
          <Link
            href={`/login`}
            className="hover:underline sm:hidden flex justify-center items-center gap-2 text-white"
          >
            <h1 className="">Кириш</h1>
            <ArrowUpRight />
          </Link>
        </div>
      </form>
    </Form>
  );
}
