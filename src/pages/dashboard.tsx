import { useState } from "react";
import { api } from "~/utils/api";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { data: session, status } = useSession(); // ✅ FIXED

  const [task, setTask] = useState("");

  const { data: tasks, isLoading, refetch } = api.task.getAll.useQuery();

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      refetch();
      setTask("");
    },
  });

  const updateTask = api.task.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => refetch(),
  });

  // Loading check
  if (status === "loading") {
    return <p className="p-10 text-center">Loading...</p>;
  }

  // Auth check
  if (!session) {
    return <p className="p-10 text-center">Please login to continue</p>;
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard 🚀
        </h1>

        <div className="flex gap-4 items-center">
          <a
            href="/profile"
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Profile
          </a>

          <button
            onClick={() => signOut()}
            className="text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Add Task */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 mb-8"
      >
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border border-white/10 bg-white/10 backdrop-blur p-2 flex-1 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What needs to be done?"
        />

        <button
          disabled={!task.trim()}
          onClick={() => createTask.mutate({ title: task })}
          className="bg-blue-600 disabled:opacity-40 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <p className="text-center text-gray-400">Loading tasks...</p>
      )}

      {/* Empty */}
      {!isLoading && tasks?.length === 0 && (
        <p className="text-center text-gray-500">
          ✨ No tasks yet. Add your first one!
        </p>
      )}

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {tasks?.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-xl flex justify-between items-center backdrop-blur border border-white/10 shadow-lg
                ${
                  t.status === "DONE"
                    ? "bg-green-500/10"
                    : "bg-yellow-500/10"
                }`}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.status === "DONE"}
                  onChange={() =>
                    updateTask.mutate({
                      id: t.id,
                      status:
                        t.status === "DONE" ? "TODO" : "DONE",
                    })
                  }
                  className="w-4 h-4 accent-green-500"
                />

                <span
                  className={`${
                    t.status === "DONE"
                      ? "line-through text-gray-400"
                      : "text-white"
                  }`}
                >
                  {t.title}
                </span>
              </div>

              {/* Right */}
              <button
                onClick={() =>
                  deleteTask.mutate({ id: t.id })
                }
                className="text-red-400 hover:text-red-300 transition"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}