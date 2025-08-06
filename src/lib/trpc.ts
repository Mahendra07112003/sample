import { initTRPC } from '@trpc/server';
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  // We'll add our procedures here
});

export type AppRouter = typeof appRouter;

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    };
  },
  ssr: false,
}); 