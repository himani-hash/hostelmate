"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"


export default function SignIn() {
   const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const router = useRouter()   // ✅ add this

  const handleLogin = async () => {

    const res = await fetch("http://127.0.0.1:5000/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    console.log(data)

    if(res.ok){
     
      localStorage.setItem("token", data.access_token)
       router.push("/dashboard")
    } else {
      alert(data.msg || "Login failed")
    }
  }

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
            <Input type="email" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)} />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            Sign In
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}