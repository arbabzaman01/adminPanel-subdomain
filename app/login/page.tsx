"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ✅ Dummy users with roles
const users = [
  { email: "superadmin@example.com", password: "super123", role: "superadmin" },
  { email: "admin1@example.com", password: "admin123", role: "admin" },
  { email: "admin2@example.com", password: "admin123", role: "admin" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (isAuthenticated === "true") {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate API

      const user = users.find((u) => u.email === email && u.password === password);

      if (!user) {
        toast.error("Invalid credentials. Please try again.", {
          position: "top-right",
        });
        setIsLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userEmail", user.email);
      }

      toast.success("Login successful!", { position: "top-right" });

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Toaster />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-xs text-muted-foreground text-center mt-4 space-y-1">
              <p>Superadmin: superadmin@example.com / super123</p>
              <p>Admin1: admin1@example.com / admin123</p>
              <p>Admin2: admin2@example.com / admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
