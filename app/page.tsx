"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/app/login/page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [router]);

  return <Login />;
}
