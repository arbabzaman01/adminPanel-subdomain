"use client";

import { Toaster } from "react-hot-toast";
import { ADMIN_LOGIN_TOAST_DURATION } from "@/utils/login-toast";

const TOAST_ANIMATION_DURATION = 350;
const EXIT_DELAY_SECONDS = (ADMIN_LOGIN_TOAST_DURATION - TOAST_ANIMATION_DURATION) / 1000;

export const LoginToastRenderer = () => (
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: ADMIN_LOGIN_TOAST_DURATION,
        className: "login-toast",
        style: {
          borderRadius: "999px",
          padding: "12px 16px",
          fontWeight: 500,
          boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
        },
        success: {
          icon: null,
          style: {
            background: "#15803d",
            color: "#ffffff",
          },
        },
        error: {
          icon: "✖",
          style: {
            background: "#b91c1c",
            color: "#ffffff",
          },
        },
      }}
    />
    <style jsx global>{`
      @keyframes login-toast-slide-in {
        from {
          transform: translateX(30px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes login-toast-slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(30px);
          opacity: 0;
        }
      }
      .login-toast {
        animation: login-toast-slide-in 0.35s ease forwards,
          login-toast-slide-out 0.35s ease forwards ${EXIT_DELAY_SECONDS}s;
      }
    `}</style>
  </>
);

