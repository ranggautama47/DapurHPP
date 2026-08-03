import { z } from "zod";

export function createLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("login.errors.emailRequired"))
      .email(t("login.errors.emailInvalid")),
    password: z
      .string()
      .min(1, t("login.errors.passwordRequired"))
      .min(8, t("login.errors.passwordMin")),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export const loginDefaultValues: LoginFormData = {
  email: "",
  password: "",
};