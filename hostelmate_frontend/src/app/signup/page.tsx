"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false) 

  const router = useRouter()

  const handleSignup = async () => {
    console.log(name,email,password,confirmPassword)

    if(password !== confirmPassword){
      alert("Passwords do not match")
      return
    }

    setLoading(true) 

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        alert("Signup successful")
        router.push("/signin")
      } else {
        alert(data.msg || "Signup failed")
      }

    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong")
    } finally {
      setLoading(false) 
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <Card className="w-[420px]">

        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>Name</Label>
            <Input type="text" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Enter password" onChange={(e)=>setPassword(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
          </div>

          <Button 
            className={`w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account? 
            <a href="/signin" className="text-blue-500 ml-1 hover:underline">
              Sign In
            </a>
          </p>

        </CardContent>

      </Card>

    </div>
  )
}