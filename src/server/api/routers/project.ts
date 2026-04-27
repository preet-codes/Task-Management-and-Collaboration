import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        OR: [
          { ownerId: ctx.session.user.id },
          { members: { some: { userId: ctx.session.user.id } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(150),
        description: z.string().max(1000).optional(),
        color: z.string().default("#1f8a70"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          color: input.color,
          ownerId: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "OWNER",
            },
          },
        },
      });

      await ctx.db.activity.create({
        data: {
          type: "PROJECT_CREATED",
          message: `Created project \"${project.name}\"`,
          userId: ctx.session.user.id,
        },
      });

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(150).optional(),
        description: z.string().max(1000).optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.projectMember.findFirst({
        where: {
          projectId: input.id,
          userId: ctx.session.user.id,
          role: { in: ["OWNER", "ADMIN"] },
        },
      });

      if (!member) throw new TRPCError({ code: "FORBIDDEN" });

      return ctx.db.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          color: input.color,
        },
      });
    }),
});
