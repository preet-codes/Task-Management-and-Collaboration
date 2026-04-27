import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const [total, completed, inProgress, overdue] = await Promise.all([
      ctx.db.task.count({
        where: {
          OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
        },
      }),
      ctx.db.task.count({
        where: {
          OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
          status: "DONE",
        },
      }),
      ctx.db.task.count({
        where: {
          OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
          status: "IN_PROGRESS",
        },
      }),
      ctx.db.task.count({
        where: {
          OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
          status: { not: "DONE" },
          deadline: { lt: new Date() },
        },
      }),
    ]);

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
    };
  }),

  recentActivity: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.activity.findMany({
      where: { userId: ctx.session.user.id },
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        task: {
          select: { id: true, title: true, status: true },
        },
      },
    });
  }),

  upcomingTasks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.task.findMany({
      where: {
        OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
        status: { not: "DONE" },
        deadline: { not: null },
      },
      orderBy: { deadline: "asc" },
      take: 8,
      select: {
        id: true,
        title: true,
        deadline: true,
        priority: true,
        status: true,
      },
    });
  }),
});
