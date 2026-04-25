import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/10 p-10 rounded-2xl shadow-2xl text-center w-full max-w-md"
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
          Task Manager
        </h1>

        <p className="text-gray-300 mb-6">
          Organize. Track. Conquer your tasks.
        </p>

        {!session ? (
          <>
            <p className="mb-6 text-gray-400">
              You are not logged in
            </p>

            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn()}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-lg transition"
              >
                Login
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/signup"
                className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-lg shadow-lg transition"
              >
                Signup
              </motion.a>
            </div>
          </>
        ) : (
          <>
            <p className="mb-6 text-gray-300">
              Welcome{" "}
              <span className="font-semibold text-white">
                {session.user?.email}
              </span>
            </p>

            <div className="flex gap-3 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-lg transition"
              >
                Dashboard
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg shadow-lg transition"
              >
                Logout
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}