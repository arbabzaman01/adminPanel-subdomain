"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { isLoggedIn, loginAdmin } from "@/utils/auth";
import { LoginToastRenderer } from "@/app/components/LoginToastRenderer";
import {
  ADMIN_LOGIN_TOAST_DURATION,
  queueAdminLoginToast,
  ADMIN_LOGIN_TOAST_MESSAGE,
} from "@/utils/login-toast";

const AdminLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
      return;
    }
    setIsCheckingSession(false);
  }, [router]);

  const handleEmptyFields = () => {
    toast.dismiss();
    toast("Please enter your credentials", {
      icon: "⚠️",
      position: "top-right",
      style: {
        background: "#fff8eb",
        color: "#92400e",
        border: "1px solid #fed7aa",
        padding: "12px 16px",
        borderRadius: "999px",
      },
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    if (!emailTrim || !passwordTrim) {
      handleEmptyFields();
      return;
    }

    setIsLoading(true);

    try {
      await loginAdmin(emailTrim, passwordTrim);

      toast.dismiss();
      toast.success(ADMIN_LOGIN_TOAST_MESSAGE, {
        duration: ADMIN_LOGIN_TOAST_DURATION,
        position: "top-right",
        className: "login-toast",
        icon: null,
      });
      queueAdminLoginToast();
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        toast.error("Invalid Credentials! Please check your username and password.", {
          duration: 6000,
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return null;
  }

  return (
    <>
      <LoginToastRenderer />
      <div className="min-h-screen flex items-center justify-center bg-emerald-600/10 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-0 text-center">
            <div className="mb-1 flex justify-center">
              <Image src="/qistlogo.png" alt="Logo" width={90} height={90} />
            </div>
            <CardTitle className="text-2xl font-bold">Secure Admin Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to securely access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* <div className="text-xs text-muted-foreground text-center mt-4">
                <p>Super Admin: superadmin@example.com / super123</p>
              </div> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminLoginScreen;

