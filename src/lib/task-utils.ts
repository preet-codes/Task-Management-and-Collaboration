export type TaskLike = {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  deadline?: Date | string | null;
};

export function completionRate(tasks: TaskLike[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((task) => task.status === "DONE").length;
  return Math.round((completed / tasks.length) * 100);
}

export function overdueCount(tasks: TaskLike[], now = new Date()): number {
  return tasks.filter((task) => {
    if (task.status === "DONE") return false;
    if (!task.deadline) return false;

    const deadline = task.deadline instanceof Date ? task.deadline : new Date(task.deadline);
    return deadline.getTime() < now.getTime();
  }).length;
}
