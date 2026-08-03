import { create } from "zustand";

export type ErrorCode =
  | "unauthorized"
  | "forbidden"
  | "notFound"
  | "rateLimit"
  | "serverError"
  | "network"
  | "unknown"
  | "sessionExpired";

interface ErrorDialogConfig {
  code: ErrorCode;
  titleKey?: string;
  descriptionKey?: string;
  buttonKey?: string;
  countdownSeconds?: number;
}

interface ErrorDialogState {
  isOpen: boolean;
  code: ErrorCode | null;
  titleKey: string;
  descriptionKey: string;
  buttonKey: string;
  countdownSeconds?: number;
  open: (config: ErrorDialogConfig) => void;
  close: () => void;
  setCountdown: (seconds: number) => void;
  tickCountdown: () => void;
}

const DEFAULT_TITLE_KEY = "errors.unknown.title";
const DEFAULT_DESCRIPTION_KEY = "errors.unknown.description";
const DEFAULT_BUTTON_KEY = "errors.unknown.button";

function deriveKey(code: ErrorCode, field: "title" | "description" | "button"): string {
  return `errors.${code}.${field}`;
}

function buildKeys(config: ErrorDialogConfig) {
  return {
    titleKey: config.titleKey ?? deriveKey(config.code, "title"),
    descriptionKey: config.descriptionKey ?? deriveKey(config.code, "description"),
    buttonKey: config.buttonKey ?? deriveKey(config.code, "button"),
  };
}

export const useErrorDialogStore = create<ErrorDialogState>()((set) => ({
  isOpen: false,
  code: null,
  titleKey: DEFAULT_TITLE_KEY,
  descriptionKey: DEFAULT_DESCRIPTION_KEY,
  buttonKey: DEFAULT_BUTTON_KEY,

  open: (config: ErrorDialogConfig) => {
    set((state) => {
      if (state.isOpen) return state;

      const keys = buildKeys(config);

      return {
        isOpen: true,
        code: config.code,
        countdownSeconds: config.countdownSeconds,
        ...keys,
      };
    });
  },

  close: () => {
    set({
      isOpen: false,
      code: null,
      titleKey: DEFAULT_TITLE_KEY,
      descriptionKey: DEFAULT_DESCRIPTION_KEY,
      buttonKey: DEFAULT_BUTTON_KEY,
      countdownSeconds: undefined,
    });
  },

  setCountdown: (seconds: number) => {
    set({ countdownSeconds: seconds });
  },

  tickCountdown: () => {
    set((state) => {
      if (state.countdownSeconds === undefined) return state;

      const next = state.countdownSeconds - 1;

      if (next <= 0) {
        return { countdownSeconds: undefined };
      }

      return { countdownSeconds: next };
    });
  },
}));
