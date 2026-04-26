"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("info", JSON.stringify(data.user));

        data.user.role === "warden"
          ? router.push("/warden-dashboard")
          : router.push("/dashboard");
      } else {
        alert(data.msg || "Login failed");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">

      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-[45%] flex items-center justify-center bg-white px-8">
        
        <div className="w-full max-w-md space-y-6">

          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to continue
            </p>
          </div>

          <div className="space-y-4">

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="mt-1 h-11"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="mt-1 h-11"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              className="w-full h-11 text-base"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

          </div>

        </div>
      </div>

  
      <div className="hidden md:block w-[55%]">
        <img
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5"
          alt="Hostel"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}