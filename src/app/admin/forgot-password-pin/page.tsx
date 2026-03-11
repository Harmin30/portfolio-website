"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  ChevronLeft,
  Loader2,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotification } from "@/lib/useNotification";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"pin" | "reset">("pin");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string; email?: string; pin?: string }>({});
  const notification = useNotification();

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate PIN format
  const isValidPin = (pin: string) => {
    return pin.length === 4 && /^\d{4}$/.test(pin);
  };

  // Get PIN form button disable reason
  const getPinButtonDisableReason = () => {
    if (!email) return "Enter your email";
    if (!isValidEmail(email)) return "Enter a valid email";
    if (!pin) return "Enter your 4-digit PIN";
    if (!isValidPin(pin)) return "PIN must be exactly 4 digits";
    return null;
  };

  const pinButtonDisableReason = getPinButtonDisableReason();
  const isPinButtonDisabled = isLoading || pinButtonDisableReason !== null;

  // Validate on submit attempt
  const validatePinForm = () => {
    const newErrors: { email?: string; pin?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!pin) {
      newErrors.pin = "PIN is required";
    } else if (!isValidPin(pin)) {
      newErrors.pin = "PIN must be exactly 4 digits";
    }

    return newErrors;
  };

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 6;
    return { hasLowercase, hasNumber, isLongEnough };
  };

  const passwordStrength = checkPasswordStrength(newPassword);
  const isPasswordStrong = Object.values(passwordStrength).every(v => v);

  // Get button disable reason
  const getButtonDisableReason = () => {
    if (!newPassword) return "Enter a password";
    if (!isPasswordStrong) {
      const missing = [];
      if (!passwordStrength.isLongEnough) missing.push("6+ characters");
      if (!passwordStrength.hasLowercase) missing.push("lowercase");
      if (!passwordStrength.hasNumber) missing.push("number");
      return `Password needs: ${missing.join(", ")}`;
    }
    if (!confirmPassword) return "Confirm your password";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const buttonDisableReason = getButtonDisableReason();
  const isButtonDisabled = isLoading || buttonDisableReason !== null;

  // Step 1: Verify PIN
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = validatePinForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        notification.error(data.message || "Invalid email or PIN");
        return;
      }

      notification.success("PIN verified! Now set your new password.");
      setStep("reset");
    } catch {
      notification.error("Error verifying PIN");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!isPasswordStrong) {
      const { hasLowercase, hasNumber, isLongEnough } = passwordStrength;
      const missing = [];
      if (!isLongEnough) missing.push("6+ characters");
      if (!hasLowercase) missing.push("lowercase letter");
      if (!hasNumber) missing.push("number");
      newErrors.newPassword = `Password needs: ${missing.join(", ")}`;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password-with-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        notification.error(data.message || "Failed to reset password");
        return;
      }

      setIsSuccess(true);
      notification.success("Password updated successfully!");

      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2000);
    } catch {
      notification.error("Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#090a0c] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-indigo-500/10 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-blue-500/10 blur-[80px] sm:blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Back Button */}
        <Link
          href="/admin/login"
          className="group mb-4 sm:mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors ml-2"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-2xl shadow-indigo-500/10">
          {step === "pin" ? (
            <>
              {/* Step 1: PIN Verification */}
              <div className="mb-8 sm:mb-10 text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 sm:mb-6 shadow-lg shadow-indigo-600/20">
                  <KeyRound className="text-white" size={22} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Enter your email and 4-digit security PIN to reset your
                  password.
                </p>
              </div>

              <form
                onSubmit={handleVerifyPin}
                className="space-y-4 sm:space-y-6"
              >
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: "" });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full bg-white dark:bg-black/20 border py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50 ${
                      errors.email
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-slate-200 dark:border-white/10 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    placeholder="admin@example.com"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 font-medium ml-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PIN Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
                    4-Digit Security PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => {
                      const newPin = e.target.value.replace(/\D/g, "");
                      setPin(newPin);
                      if (errors.pin) {
                        setErrors({ ...errors, pin: "" });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full bg-white dark:bg-black/20 border py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50 text-center text-lg tracking-widest font-bold ${
                      errors.pin
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-slate-200 dark:border-white/10 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                    placeholder="••••"
                  />
                  {errors.pin && (
                    <p className="text-[11px] text-red-500 font-medium ml-1">
                      {errors.pin}
                    </p>
                  )}
                  {!errors.pin && pin && (
                    <p className={`text-[11px] ml-1 ${pin.length === 4 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                      {pin.length === 4 ? "✓ PIN complete" : `${4 - pin.length} ${4 - pin.length === 1 ? "digit" : "digits"} remaining`}
                    </p>
                  )}
                  {!errors.pin && !pin && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                      This was set up in your admin Settings
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isPinButtonDisabled}
                  type="submit"
                  className="relative w-full py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                  ) : (
                    <>
                      <span>Verify PIN</span>
                      <KeyRound size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : isSuccess ? (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-6">
                  <CheckCircle className="text-emerald-500" size={32} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Password Updated!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Your password has been changed successfully. Redirecting to
                  login...
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Reset Password */}
              <div className="mb-8 sm:mb-10 text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 sm:mb-6 shadow-lg shadow-indigo-600/20">
                  <Lock className="text-white" size={22} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Create a strong new password for your admin account.
                </p>
              </div>

              <form
                onSubmit={handleResetPassword}
                className="space-y-4 sm:space-y-6"
              >
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) {
                          setErrors({ ...errors, newPassword: "" });
                        }
                      }}
                      required
                      disabled={isLoading}
                      className={`w-full bg-white dark:bg-black/20 border py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50 ${
                        errors.newPassword
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-slate-200 dark:border-white/10 focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-[11px] text-red-500 font-medium ml-1">
                      {errors.newPassword}
                    </p>
                  )}
                  {/* Password Requirements */}
                  <div className="text-xs space-y-1.5 mt-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                    <div
                      className={
                        passwordStrength.isLongEnough
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500"
                      }
                    >
                      {passwordStrength.isLongEnough ? "✓" : "○"} At least 6 characters
                    </div>
                    <div
                      className={
                        passwordStrength.hasLowercase
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500"
                      }
                    >
                      {passwordStrength.hasLowercase ? "✓" : "○"} One lowercase letter (a-z)
                    </div>
                    <div
                      className={
                        passwordStrength.hasNumber
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500"
                      }
                    >
                      {passwordStrength.hasNumber ? "✓" : "○"} One number (0-9)
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: "" });
                        }
                      }}
                      required
                      disabled={isLoading}
                      className={`w-full bg-white dark:bg-black/20 border py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50 ${
                        errors.confirmPassword
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-slate-200 dark:border-white/10 focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-red-500 font-medium ml-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                  {/* Confirm Status */}
                  {newPassword && confirmPassword && (
                    <div
                      className={`text-xs mt-2 pl-3 ${newPassword === confirmPassword ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {newPassword === confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isButtonDisabled}
                  type="submit"
                  className="relative w-full py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <Lock size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-xl">
          <p className="text-xs text-blue-900 dark:text-blue-300">
            <span className="font-bold">💡 Note:</span> Your 4-digit PIN was set
            during admin setup. If you've forgotten it, use the{" "}
            <Link href="/admin/recovery" className="underline font-semibold">
              recovery guide
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}
