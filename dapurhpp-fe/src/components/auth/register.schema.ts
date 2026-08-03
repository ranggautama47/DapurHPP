import { z } from "zod";

export function createRegisterSchema(t: (key: string) => string) {
  return z.object({
    namaLengkap: z
      .string()
      .min(1, t("register.errors.nameRequired"))
      .min(3, t("register.errors.nameMin")),
    namaBisnis: z.string().optional(),
    email: z
      .string()
      .min(1, t("register.errors.emailRequired"))
      .email(t("register.errors.emailInvalid")),
    password: z
      .string()
      .min(1, t("register.errors.passwordRequired"))
      .min(8, t("register.errors.passwordMin"))
      .regex(/[A-Z]/, t("register.errors.passwordUpper"))
      .regex(/[0-9]/, t("register.errors.passwordNumber")),
  });
}

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

export const registerDefaultValues: RegisterFormData = {
  namaLengkap: "",
  namaBisnis: "",
  email: "",
  password: "",
};