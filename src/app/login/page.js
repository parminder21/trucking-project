"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [shakeFields, setShakeFields] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /** Reset shake animation */
  useEffect(() => {
    if (shakeFields.email || shakeFields.password) {
      const t = setTimeout(() => {
        setShakeFields({ email: false, password: false });
      }, 400);
      return () => clearTimeout(t);
    }
  }, [shakeFields]);

  /** FORM SUBMIT */
  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = { email: "", password: "" };
    let hasError = false;

    if (!email.trim()) {
      nextErrors.email = "Please enter your email";
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email";
      hasError = true;
    }

    if (!password.trim()) {
      nextErrors.password = "Please enter your password";
      hasError = true;
    }

    setErrors(nextErrors);
    setShakeFields({
      email: !!nextErrors.email,
      password: !!nextErrors.password,
    });

    if (hasError) return;

    // --- STATIC LOGIN CHECK ---
    if (email === "admin@admin.com" && password === "12345") {
      setLoading(true);
      setTimeout(() => router.push("/dashboard"), 1200);
      return;
    }

    // Invalid login
    setErrors({ email: "", password: "Invalid credentials. Try again." });
    setShakeFields({ email: false, password: true });
  };

  /** shake helper class */
  const shakeClass = (flag) => (flag ? "animate-shake" : "");

  return (
    <div className="relative min-h-screen w-full antialiased">
      {/* background */}
      <div
        className="absolute inset-0 -z-10 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/images/login-bg.png')" }}
      />
      <div className="absolute inset-0 -z-0 bg-black/45" />

      {/* Left side heading */}
      <div className="absolute left-12 bottom-12 z-20 max-w-lg text-white hidden lg:block">
        <h2
          className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-lg 
                     bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 
                     bg-clip-text text-transparent animate-heading relative inline-block"
        >
          Streamline Your Fleet Operations with Confidence
          <span className="absolute left-0 bottom-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-underline"></span>
        </h2>
        <p className="mt-3 text-sm text-white/85 animate-fadeIn">
          Powerful insights, real-time control, and seamless management — built to empower logistics.
        </p>
      </div>

      {/* Form */}
      <div className="min-h-screen flex items-center justify-end">
        <div className="w-full px-6 sm:px-10 py-10 md:py-16">
          <div className="relative max-w-md lg:max-w-lg ml-auto lg:-mr-6">
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
              
              {/* Logo */}
              <div className="flex flex-row items-center gap-4 mb-6">
                <div
                  className="flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold"
                  style={{ width: 52, height: 52 }}
                >
                  <span className="text-xl">TS</span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                    Welcome Back
                  </div>
                  <div className="text-sm text-slate-500">
                    Admin Panel — secure · fast · reliable
                  </div>
                </div>
              </div>

              {/* Form Start */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Email</label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@trucking.com"
                    className={`mt-2 w-full border rounded-lg px-4 py-3 text-slate-800 text-sm transition
                    ${errors.email ? "border-red-400" : "border-slate-200 focus:border-orange-400"}
                    ${shakeClass(shakeFields.email)}`}
                  />

                  {errors.email && (
                    <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Password</label>

                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm text-slate-800 transition
                      ${errors.password ? "border-red-400" : "border-slate-200 focus:border-orange-400"}
                      ${shakeClass(shakeFields.password)}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-slate-700">Remember</span>
                  </label>

                  <button type="button" className="text-orange-500 font-medium">
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-semibold shadow-lg
                    bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400
                    hover:from-orange-600 hover:via-amber-500 hover:to-orange-600
                    transition-all duration-300"
                >
                  Sign In
                </button>

                <p className="text-center text-sm text-slate-600">
                  Don&apos;t have an account?{" "}
                  <button className="text-orange-500 font-medium">Contact admin</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <Image
            src="/images/truck-loader.gif"
            alt="Loading..."
            className="w-32 h-32 object-contain"
            width={200}
            height={200}
          />
        </div>
      )}

      {/* ANIMATIONS */}
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.35s both; }

        @keyframes headingFadeSlide {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-heading { animation: headingFadeSlide 1s ease-out forwards; }

        @keyframes underline {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        .animate-underline { animation: underline 1s ease-out 0.5s forwards; transform-origin:left; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
