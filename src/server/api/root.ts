// import { postRouter } from "~/server/api/routers/post";
// import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
// import { taskRouter } from "./routers/task";
// /**
//  * This is the primary router for your server.
//  *
//  * All routers added in /api/routers should be manually added here.
//  */
// export const appRouter = createTRPCRouter({
//   task: taskRouter,
// });
// export const appRouter = createTRPCRouter({
//   post: postRouter,
// });

// // export type definition of API
// export type AppRouter = typeof appRouter;

// /**
//  * Create a server-side caller for the tRPC API.
//  * @example
//  * const trpc = createCaller(createContext);
//  * const res = await trpc.post.all();
//  *       ^? Post[]
//  */
// export const createCaller = createCallerFactory(appRouter);
import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { taskRouter } from "./routers/task";
import { authRouter } from "./routers/auth";

export const appRouter = createTRPCRouter({
  post: postRouter,
  task: taskRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);