"use client";

import { useEffect, useRef, useState } from "react";

export default function LoginPage() {
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Send OTP
  async function handleSendOTP(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setStep("otp");
      setCountdown(60);
      setMessage("OTP sent successfully");

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    } catch (error) {
      setError("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // OTP input
  function handleOtpChange(index, value) {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");
    setMessage("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Backspace
  function handleOtpKeyDown(index, e) {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  // Paste OTP
  function handleOtpPaste(e) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, 5);

    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
    }, 50);
  }

  // Verify OTP
  async function handleVerifyOTP(e) {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      setMessage("Login successful!");

      // Change this to your dashboard
      window.location.href = "/dashboard";

    } catch (error) {
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOTP() {
    if (countdown > 0 || loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setMessage("New OTP sent successfully");

      inputRefs.current[0]?.focus();

    } catch (error) {
      setError("Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  // Change email
  function changeEmail() {
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setMessage("");
    setCountdown(0);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] flex items-center justify-center px-4">

      <div className="w-full max-w-[420px]">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                A
              </span>
            </div>
          </div>

          {/* EMAIL STEP */}
          {step === "email" && (
            <>
              <div className="text-center">

                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Welcome back
                </h1>

                <p className="text-gray-500 mt-2">
                  Enter your email to continue
                </p>

              </div>

              <form
                onSubmit={handleSendOTP}
                className="mt-8"
              >

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="name@domain.com"
                  required
                  autoComplete="email"
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition
                    focus:border-black
                    focus:ring-4
                    focus:ring-black/5
                  "
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    h-12
                    mt-4
                    rounded-xl
                    bg-black
                    text-white
                    font-medium
                    transition
                    hover:bg-gray-800
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>

              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                We'll send a one-time verification code to your email.
              </p>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <>
              <div className="text-center">

                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Check your email
                </h1>

                <p className="text-gray-500 mt-2">
                  We sent a 6-digit code to
                </p>

                <p className="font-medium text-gray-900 mt-1 break-all">
                  {email}
                </p>

              </div>

              <form
                onSubmit={handleVerifyOTP}
                className="mt-8"
              >

                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter verification code
                </label>

                <div
                  className="flex justify-center gap-2"
                  onPaste={handleOtpPaste}
                >

                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(index, e)
                      }
                      className="
                        w-12
                        h-14
                        sm:w-14
                        sm:h-16
                        text-center
                        text-xl
                        font-semibold
                        rounded-xl
                        border
                        border-gray-300
                        outline-none
                        transition
                        focus:border-black
                        focus:ring-4
                        focus:ring-black/5
                      "
                    />
                  ))}

                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    otp.join("").length !== 6
                  }
                  className="
                    w-full
                    h-12
                    mt-6
                    rounded-xl
                    bg-black
                    text-white
                    font-medium
                    transition
                    hover:bg-gray-800
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

              </form>

              {/* Resend */}
              <div className="text-center mt-6">

                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in{" "}
                    <span className="font-medium text-gray-900">
                      {countdown}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm font-medium text-black hover:underline"
                  >
                    Resend code
                  </button>
                )}

              </div>

              {/* Change email */}
              <button
                type="button"
                onClick={changeEmail}
                className="
                  w-full
                  mt-4
                  text-sm
                  text-gray-500
                  hover:text-gray-900
                  transition
                "
              >
                ← Use a different email
              </button>
            </>
          )}

          {/* Messages */}
          {message && (
            <div className="mt-5 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
              <p className="text-sm text-green-700 text-center">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm text-red-600 text-center">
                {error}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 My App. All rights reserved.
        </p>

      </div>

    </main>
  );
}