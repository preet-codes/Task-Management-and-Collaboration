import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login</p>
      </div>
    );
  }

  const initials = session.user?.email?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-white/10 border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        {/* Avatar */}
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
          {initials}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400 mb-6">
          Your account details
        </p>

        {/* Info */}
        <div className="space-y-3 text-left">
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white">{session.user?.email}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Name</p>
            <p className="text-white">
              {session.user?.name || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Role</p>
            <p className="text-white">{session.user?.role}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 justify-center">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Dashboard
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}