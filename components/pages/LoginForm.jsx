"use client";

import React, { useState, useEffect } from "react";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../shared/customFormField";
import SubmitButton from "../shared/submitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UpdateLoginValidation } from "@/lib/validation";
import { ArrowUpRight } from "lucide-react";
export default function LoginForm() {
  const RegisterValidation = UpdateLoginValidation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 sm:space-y-4 w-ful rounded-md"
      >
        <div className="w-full flex flex-col gap-6">
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
            inputClass="rounded-md border-[2px] focus:ring-0 focus-visible:ring-0"
          />
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
              Аккаунт мавжуд эмасми?
              <Link href={`/register`} className="hover:underline font-bold ">
                {" Янги аккаунт очиш"}
              </Link>
            </h1>
          </div>
          <Link
            href={`/register`}
            className="hover:underline sm:hidden flex justify-center items-center gap-2 text-white"
          >
            <h1 className="">Янги аккаунт очиш</h1>
            <ArrowUpRight />
          </Link>
        </div>
      </form>
    </Form>
  );
}
