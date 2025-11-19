"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [shakeFields, setShakeFields] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (shakeFields.email || shakeFields.password) {
      const t = setTimeout(() => setShakeFields({ email: false, password: false }), 380);
      return () => clearTimeout(t);
    }
  }, [shakeFields]);

  function handleSubmit(e) {
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

    if (!password) {
      nextErrors.password = "Please enter your password";
      hasError = true;
    }

    setErrors(nextErrors);
    setShakeFields({ email: !!nextErrors.email, password: !!nextErrors.password });

    if (hasError) return;

    // static credentials check
    if (email === "admin@admin.com" && password === "12345") {
      setLoading(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } else {
      setErrors({
        email: "",
        password: "Invalid credentials. Try again.",
      });
      setShakeFields({ email: false, password: true });
    }
  }

  const shakeClass = (flag) => (flag ? "animate-shake" : "");

  return (
    <div className="relative min-h-screen w-full antialiased">
      {/* full background */}
      <div
        className="absolute inset-0 -z-10 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/images/login-bg.png')" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-5 bg-black/45" />

      {/* premium heading */}
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
          Powerful insights, real-time control, and seamless management — built to empower logistics,
          drivers, and business performance.
        </p>
      </div>

      {/* login form */}
      <div className="min-h-screen flex items-center justify-end">
        <div className="w-full px-6 sm:px-10 py-10 md:py-16">
          <div className="relative max-w-md lg:max-w-lg ml-auto lg:-mr-6">
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
              {/* logo + heading */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold"
                    style={{ width: 48, height: 48 }}
                  >
                    <span className="text-lg sm:text-xl">TS</span>
                  </div>
                </div>
                <div className="mt-1 sm:mt-0">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                    Welcome Back
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Admin Panel — secure · fast · reliable
                  </div>
                </div>
              </div>

              {/* form */}
              <form onSubmit={handleSubmit} className="mt-2 space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@trucking.com"
                    className={`mt-2 w-full border rounded-lg px-4 py-3 text-slate-800 text-sm focus:outline-none transition ${
                      errors.email
                        ? "border-red-400"
                        : "border-slate-200 focus:border-orange-300"
                    } ${shakeClass(shakeFields.email)}`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      ref={passRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className={`w-full border rounded-lg px-4 py-3 pr-12 text-slate-800 text-sm focus:outline-none transition ${
                        errors.password
                          ? "border-red-400"
                          : "border-slate-200 focus:border-orange-300"
                      } ${shakeClass(shakeFields.password)}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-2 flex items-center px-2 text-slate-500 cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-5 h-5 rounded-md border-2 border-slate-300 accent-orange-500"
                    />
                    <span className="text-slate-700 text-sm ml-2">Remember</span>
                  </label>

                  <a href="#" className="text-orange-500 font-medium">
                    Forgot Password?
                  </a>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-white font-semibold shadow-lg
                              bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400
                              hover:from-orange-600 hover:via-amber-500 hover:to-orange-600
                              hover:shadow-[0_8px_25px_rgba(249,115,22,0.45)]
                              hover:-translate-y-[2px] active:translate-y-0
                              transition-all duration-300 ease-out cursor-pointer tracking-wide"
                  >
                    Sign In
                  </button>
                </div>

                <p className="text-center text-sm text-slate-600">
                  Don't have an account?{" "}
                  <a href="#" className="text-orange-500 font-medium">
                    Contact admin
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <img
            src="/images/truck-loader.gif"
            alt="Loading..."
            className="w-40 h-40 object-contain animate-pulse"
          />
        </div>
      )}

      {/* --- All animations here --- */}
      <style>{`
        @keyframes shake {10%,90%{transform:translateX(-1px);}20%,80%{transform:translateX(2px);}30%,50%,70%{transform:translateX(-4px);}40%,60%{transform:translateX(4px);}}
        .animate-shake { animation: shake 0.36s cubic-bezier(.36,.07,.19,.97) both; }

        @keyframes headingFadeSlide {
          0% { opacity: 0; transform: translateY(12px) scale(0.98); letter-spacing: 0.5px; }
          100% { opacity: 1; transform: translateY(0) scale(1); letter-spacing: 0.2px; }
        }
        .animate-heading { animation: headingFadeSlide 1s ease-out forwards; }

        @keyframes underline {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .animate-underline {
          animation: underline 1s ease-out 0.5s forwards;
          transform-origin: left;
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1.2s ease-out 0.8s forwards; opacity: 0; }

        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
}
