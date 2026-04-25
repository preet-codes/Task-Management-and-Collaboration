import { api } from "~/utils/api";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const signup = api.auth.signup.useMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const handleSignup = async () => {
    // reset errors
    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });

    let hasError = false;

    // NAME VALIDATION
    if (!name.trim() || name.length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be at least 2 characters",
      }));
      hasError = true;
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email format",
      }));
      hasError = true;
    }

    // PASSWORD VALIDATION
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Minimum 6 characters required",
      }));
      hasError = true;
    } else if (!/[A-Z]/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Must include 1 uppercase letter",
      }));
      hasError = true;
    } else if (!/[0-9]/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Must include 1 number",
      }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      await signup.mutateAsync({ email, password, name });
      router.push("/login");
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        general: e?.message || "Signup failed",
      }));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-white/10 border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 text-center">
          Create Account ✨
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Start managing your tasks today
        </p>

        {/* Inputs */}
        <div className="space-y-3">
          {/* NAME */}
          <div>
            <input
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-green-500"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* GENERAL ERROR */}
        {errors.general && (
          <p className="text-red-400 text-sm text-center mt-3">
            {errors.general}
          </p>
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          disabled={loading}
          onClick={handleSignup}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Signup"}
        </motion.button>

        {/* Login link */}
        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-400 hover:underline"
          >
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}