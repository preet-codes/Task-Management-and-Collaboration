import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
        }

        const passwordHash = await bcrypt.hash(input.password, 10);

        return ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: passwordHash,
          },
          select: { id: true, name: true, email: true, createdAt: true },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientInitializationError ||
          error instanceof Prisma.PrismaClientKnownRequestError
        ) {
          throw new TRPCError({
            code: "SERVICE_UNAVAILABLE",
            message: "Database connection failed. Please verify Supabase connection settings.",
          });
        }

        throw error;
      }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        title: true,
        timezone: true,
        emailAlerts: true,
        createdAt: true,
        _count: {
          select: {
            ownedTasks: true,
            assignedTasks: true,
            ownedProjects: true,
          },
        },
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user;
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100).optional(),
        bio: z.string().max(500).optional(),
        title: z.string().max(120).optional(),
        timezone: z.string().max(100).optional(),
        emailAlerts: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          title: true,
          timezone: true,
          emailAlerts: true,
        },
      });

      await ctx.db.activity.create({
        data: {
          type: "PROFILE_UPDATED",
          message: "Updated profile settings",
          userId: ctx.session.user.id,
        },
      });

      return user;
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(6),
        newPassword: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { id: true, password: true },
      });

      if (!user?.password) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Password login not configured" });
      }

      const valid = await bcrypt.compare(input.currentPassword, user.password);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
      }

      const passwordHash = await bcrypt.hash(input.newPassword, 10);
      await ctx.db.user.update({
        where: { id: user.id },
        data: { password: passwordHash },
      });

      return { success: true };
    }),
});
