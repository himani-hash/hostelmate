"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        alert("If this email exists, a reset link has been sent.");
      } else {
        alert(data.msg || "Something went wrong");
      }

    } catch (error) {
      console.error(error);
      alert("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <Card className="w-full max-w-md shadow-lg">
        
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Forgot Password
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Enter your email to receive a reset link
          </p>
        </CardHeader>

        <CardContent className="space-y-4">

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="mt-1 h-11"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            className="w-full h-11"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

        </CardContent>

      </Card>

    </div>
  );
}