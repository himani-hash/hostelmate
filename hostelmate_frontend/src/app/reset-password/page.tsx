"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          password
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert("Password reset successful")
        router.push("/") 
      } else {
        alert(data.msg || "Error resetting password")
      }

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <Card className="w-full max-w-md shadow-lg">

        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Reset Password
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Enter your new password
          </p>
        </CardHeader>

        <CardContent className="space-y-4">

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="mt-1 h-11"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm password"
              className="mt-1 h-11"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full h-11"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}