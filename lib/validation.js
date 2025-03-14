import { z } from "zod";

export const UpdateRegisterValidation = () => {
  return z.object({
    name: z.string().min(3, { message: "Имя не существует (минимум 3 буквы)" }),
    phone: z.string().min(13, { message: "Номер телефона не существует." }),
    password: z
      .string()
      .min(8, { message: "Используйте 8 или более символов." }),
    privacy_policy: z.boolean(),
  });
};

export const UpdateLoginValidation = () => {
  return z.object({
    phone: z.string().min(13, { message: "Номер телефона недоступен" }),
    password: z.string().min(8, { message: "Вы не ввели пароль." }),
  });
};
