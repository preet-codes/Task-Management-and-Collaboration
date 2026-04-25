import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleLogin = async () => {
    // reset errors
    setErrors({
      email: "",
      password: "",
      general: "",
    });

    let hasError = false;

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
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      await router.push("/dashboard");
      router.reload(); // ensures session is fresh
    } else {
      setErrors((prev) => ({
        ...prev,
        general: "Invalid email or password",
      }));
    }
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
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Login to continue managing your tasks
        </p>

        {/* Inputs */}
        <div className="space-y-3">
          {/* EMAIL */}
          <div>
            <input
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500"
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
          onClick={handleLogin}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        {/* Signup link */}
        <p className="text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:underline"
          >
            Signup
          </a>
        </p>
      </motion.div>
    </div>
  );
}