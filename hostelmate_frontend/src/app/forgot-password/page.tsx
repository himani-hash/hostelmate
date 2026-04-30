"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"
import { Building2, Loader2 } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("If this email exists, a reset link has been sent.");
      } else {
        setError(data.error || data.msg || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const white = "white";
  const whiteSoft = "rgba(255,255,255,0.95)";
  const whiteFaded = "rgba(255,255,255,0.85)";
  const inputBg = "rgba(255,255,255,0.08)";
  const inputBorder = "rgba(255,255,255,0.3)";
  const cardBg = "rgba(0,0,0,0.55)";
  const filmBg = "rgba(0,0,0,0.25)";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2000&q=80"
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm"
      />

      <div style={{ backgroundColor: filmBg }} className="absolute inset-0" />

      <div className="relative z-10 flex items-center gap-2 p-6 sm:p-8">
        <div
          style={{ backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.25)" }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md"
        >
          <Building2 style={{ color: white }} className="h-5 w-5" />
        </div>
        <span style={{ color: white }} className="text-lg font-semibold tracking-tight">
          HostelMate
        </span>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 pb-10 sm:px-6">
        <div className="w-full max-w-md">
          <div
            style={{ backgroundColor: cardBg, borderColor: "rgba(255,255,255,0.25)" }}
            className="rounded-2xl border p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8"
          >
            <div className="space-y-1.5 text-center">
              <h1 style={{ color: white }} className="text-3xl font-bold tracking-tight sm:text-4xl">
                Forgot password
              </h1>
              <p style={{ color: whiteSoft }} className="text-sm">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {error && (
                <div
                  style={{
                    backgroundColor: "rgba(239,68,68,0.15)",
                    borderColor: "rgba(252,165,165,0.4)",
                    color: "rgb(254,202,202)",
                  }}
                  className="rounded-lg border px-4 py-2.5 text-sm backdrop-blur-sm"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    backgroundColor: "rgba(34,197,94,0.15)",
                    borderColor: "rgba(134,239,172,0.4)",
                    color: "rgb(187,247,208)",
                  }}
                  className="rounded-lg border px-4 py-2.5 text-sm backdrop-blur-sm"
                >
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: white }} className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ color: white, backgroundColor: inputBg, borderColor: inputBorder }}
                  className="h-11 placeholder:text-white/50"
                  required
                  autoComplete="email"
                />
              </div>

              <Button
                type="submit"
                style={{ backgroundColor: white, color: "#0a0a0a" }}
                className="h-11 w-full text-base font-semibold shadow-lg shadow-black/30 transition-all hover:opacity-90 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>

            <p style={{ color: whiteSoft }} className="mt-6 text-center text-sm">
              Remember your password?{" "}
              <Link href="/signin" style={{ color: white }} className="font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p style={{ color: whiteFaded }} className="mt-6 text-center text-xs">
            &copy; {new Date().getFullYear()} HostelMate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
