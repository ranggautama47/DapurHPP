"use client";

import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useErrorDialogStore } from "@/lib/error-dialog-store";
import { useTranslation } from "@/context/language-context";

export function GlobalErrorDialog() {
  const store = useErrorDialogStore();
  const { t } = useTranslation("errors");

  const isCounting = store.code === "rateLimit" && store.countdownSeconds !== undefined;

  useEffect(() => {
    if (!isCounting) return;

    const id = setInterval(() => {
      useErrorDialogStore.getState().tickCountdown();
    }, 1000);

    return () => clearInterval(id);
  }, [isCounting]);

  const buttonText = store.countdownSeconds
    ? `${t(store.buttonKey)} (${store.countdownSeconds}s)`
    : t(store.buttonKey);

  return (
    <AlertDialog
      open={store.isOpen}
      onOpenChange={(open) => {
        if (!open) store.close();
      }}
    >
      <AlertDialogContent>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8A00] via-[#EF4444] to-[#FF8A00]" />
        <AlertDialogHeader>
          <AlertDialogTitle>{t(store.titleKey)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(store.descriptionKey)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => store.close()}
            className="bg-[#FF8A00] text-white hover:bg-[#E67E00] active:scale-[0.98]"
          >
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
