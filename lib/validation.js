import { z } from "zod";

export const UpdateRegisterValidation = () => {
  return z.object({
    name: z.string().min(3, { message: "Исм мавжуд эмас (Камида 3 та харф)" }),
    phone: z.string().min(13, { message: "Телефон ракам мавжуд эмас" }),
    password: z
      .string()
      .min(8, { message: "8 йоки ундан ортиқ белгидан фойдаланинг" }),
    privacy_policy: z.boolean(),
  });
};

export const UpdateLoginValidation = () => {
  return z.object({
    phone: z.string().min(13, { message: "Телефон ракам мавжуд эмас" }),
    password: z.string().min(8, { message: "Парольны киритмадингез" }),
  });
};
