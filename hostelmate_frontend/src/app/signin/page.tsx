"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();
      console.log("kalu=>",data);

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("info", JSON.stringify(data.user));

        data.user.role === "warden" ? router.push("/warden-dashboard") : router.push("/dashboard");
        // router.push("/dashboard");
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <Card className="w-[400px]">
        
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Sign In
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              onChange={(e)=>setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input 
              type="password" 
              placeholder="Enter your password" 
              onChange={(e)=>setPassword(e.target.value)} 
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleLogin}
            disabled={loading} // 👈 disable button
          >
            {loading ? "Signing in..." : "Sign In"} 
          </Button>

        </CardContent>

      </Card>

    </div>
  );
}