import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, "Name must be at least 2 characters"),

        email: z
          .string()
          .email("Invalid email format"),

        password: z
          .string()
          .min(6, "Password must be at least 6 characters")
          .regex(/[A-Z]/, "Must include 1 uppercase letter")
          .regex(/[0-9]/, "Must include 1 number"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new Error("User already exists");
      }

      const hashed = await bcrypt.hash(input.password, 10);

      return ctx.db.user.create({
        data: {
          email: input.email,
          password: hashed,
          name: input.name,
        },
      });
    }),
});