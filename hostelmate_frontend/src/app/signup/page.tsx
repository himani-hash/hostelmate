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
  const router = useRouter()

  const handleSignup = async () => {
  console.log(name,email,password,confirmPassword)

  if(password !== confirmPassword){
    alert("Passwords do not match")
    return
  }

  const res = await fetch("http://127.0.0.1:5000/api/register",{
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

  if(res.ok){
    alert(data.message)

    if(data.access_token){
      localStorage.setItem("token", data.access_token)
      router.push("/dashboard")
    } 
    
    else {
      router.push("/signin")
    }

  } else {
    alert(data.msg || "Signup failed")
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

          <Button className="w-full" onClick={handleSignup}>
            Sign Up
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