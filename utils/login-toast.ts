"use client";

const TOAST_FLAG_KEY = "showAdminToast";
const TOAST_TIMESTAMP_KEY = "showAdminToastTime";

export const ADMIN_LOGIN_TOAST_MESSAGE = "Login successful. Your admin dashboard is ready.";
export const ADMIN_LOGIN_TOAST_DURATION = 7000;

const isBrowser = () => typeof window !== "undefined";

export const queueAdminLoginToast = () => {
  if (!isBrowser()) return;

  localStorage.setItem(TOAST_FLAG_KEY, "true");
  localStorage.setItem(TOAST_TIMESTAMP_KEY, Date.now().toString());
};

export const consumeQueuedAdminToast = (): { message: string; duration: number } | null => {
  if (!isBrowser()) return null;

  const shouldShow = localStorage.getItem(TOAST_FLAG_KEY);
  if (shouldShow !== "true") {
    return null;
  }

  const timestampRaw = localStorage.getItem(TOAST_TIMESTAMP_KEY);
  localStorage.removeItem(TOAST_FLAG_KEY);
  localStorage.removeItem(TOAST_TIMESTAMP_KEY);

  const timestamp = timestampRaw ? Number(timestampRaw) : NaN;
  const elapsed = Number.isFinite(timestamp) ? Date.now() - timestamp : 0;
  const remaining = ADMIN_LOGIN_TOAST_DURATION - elapsed;

  if (remaining <= 0) {
    return null;
  }

  return {
    message: ADMIN_LOGIN_TOAST_MESSAGE,
    duration: remaining,
  };
};

