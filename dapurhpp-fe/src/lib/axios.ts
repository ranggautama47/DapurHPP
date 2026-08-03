import axios from "axios";
import { useAuthStore, setTokenCookie } from "./auth-store";
import { useErrorDialogStore, type ErrorCode } from "./error-dialog-store";

const STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  401: "sessionExpired",
  403: "forbidden",
  404: "notFound",
  409: "unknown",
  422: "unknown",
  429: "rateLimit",
};

function statusToErrorCode(status: number): ErrorCode {
  return STATUS_TO_ERROR_CODE[status] ?? "serverError";
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      setTokenCookie(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 429) {
      const retryAfter = Number(error.response?.headers["retry-after"]);
      const countdownSeconds =
        Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60;

      useErrorDialogStore.getState().open({ code: "rateLimit", countdownSeconds });
      return Promise.reject(error);
    }

    if (status !== undefined && status < 500) {
      useErrorDialogStore.getState().open({ code: statusToErrorCode(status) });
      return Promise.reject(error);
    }

    if (status !== undefined && status >= 500) {
      useErrorDialogStore.getState().open({ code: "serverError" });
      return Promise.reject(error);
    }

    useErrorDialogStore.getState().open({ code: "network" });
    return Promise.reject(error);
  }
);