"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { isLoggedIn, loginAdmin } from "@/utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
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

    if (!email.trim() || !password.trim()) {
      handleEmptyFields();
      return;
    }

    setIsLoading(true);

    try {
      await loginAdmin(email, password);

      toast.success("Login successful!", { position: "top-right" });
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        toast.error("Invalid credentials. Please try again.", {
          position: "top-right",
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
    <div className="min-h-screen flex items-center justify-center bg-emerald-600/10 p-4">
      <Toaster />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-0 text-center">
          <div className="mb-1 flex justify-center">
          <Image src="/qistlogo.png" alt="Logo" width={90}height={90} />
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
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

          <div className="text-xs text-muted-foreground text-center mt-4 space-y-1">
 
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
