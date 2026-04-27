import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(5000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  deadline: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
});

const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string(),
});

export const taskRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
          priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
          projectId: z.string().optional(),
          assigneeId: z.string().optional(),
          search: z.string().optional(),
          page: z.number().int().min(1).default(1),
          limit: z.number().int().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const filters = input ?? { page: 1, limit: 20 };
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = {
        OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
      };

      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;
      if (filters.projectId) where.projectId = filters.projectId;
      if (filters.assigneeId) where.assigneeId = filters.assigneeId;
      if (filters.search) {
        where.AND = [
          {
            OR: [
              { title: { contains: filters.search, mode: "insensitive" } },
              { description: { contains: filters.search, mode: "insensitive" } },
            ],
          },
        ];
      }

      const [tasks, total] = await Promise.all([
        ctx.db.task.findMany({
          where,
          include: {
            owner: { select: { id: true, name: true, email: true } },
            assignee: { select: { id: true, name: true, email: true } },
            project: { select: { id: true, name: true, color: true } },
          },
          orderBy: { updatedAt: "desc" },
          skip,
          take: limit,
        }),
        ctx.db.task.count({ where }),
      ]);

      return {
        tasks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findFirst({
        where: {
          id: input.id,
          OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
        },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          assignee: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, name: true, color: true } },
          activities: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      });

      if (!task) throw new TRPCError({ code: "NOT_FOUND" });
      return task;
    }),

  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          deadline: input.deadline,
          tags: input.tags,
          projectId: input.projectId,
          assigneeId: input.assigneeId,
          ownerId: ctx.session.user.id,
        },
      });

      await ctx.db.activity.create({
        data: {
          type: "TASK_CREATED",
          message: `Created task \"${task.title}\"`,
          taskId: task.id,
          userId: ctx.session.user.id,
        },
      });

      return task;
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.task.findFirst({
        where: { id, ownerId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const task = await ctx.db.task.update({
        where: { id },
        data,
      });

      await ctx.db.activity.create({
        data: {
          type: "TASK_UPDATED",
          message: `Updated task \"${task.title}\"`,
          taskId: task.id,
          userId: ctx.session.user.id,
        },
      });

      return task;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.task.findFirst({
        where: {
          id: input.id,
          OR: [{ ownerId: ctx.session.user.id }, { assigneeId: ctx.session.user.id }],
        },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const task = await ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status },
        select: { id: true, title: true, status: true },
      });

      await ctx.db.activity.create({
        data: {
          type: input.status === "DONE" ? "TASK_COMPLETED" : "TASK_STATUS_CHANGED",
          message:
            input.status === "DONE"
              ? `Completed task \"${task.title}\"`
              : `Changed status to ${input.status.replace("_", " ").toLowerCase()}`,
          taskId: task.id,
          userId: ctx.session.user.id,
        },
      });

      return task;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.task.findFirst({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db.activity.deleteMany({ where: { taskId: input.id } });
      await ctx.db.task.delete({ where: { id: input.id } });

      await ctx.db.activity.create({
        data: {
          type: "TASK_DELETED",
          message: `Deleted task \"${existing.title}\"`,
          userId: ctx.session.user.id,
          metadata: { taskTitle: existing.title },
        },
      });

      return { success: true };
    }),
});
