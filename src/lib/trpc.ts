import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { cache } from 'react';
import { ZodError } from 'zod';

// Create context for tRPC
export const createTRPCContext = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return {
        session,
        user: session?.user ?? null,
    };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Initialize tRPC without superjson for now to avoid conflicts
const t = initTRPC.context<Context>().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

// Create reusable router and procedure helpers
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            ...ctx,
            session: { ...ctx.session, user: ctx.user },
        },
    });
});

// Admin procedure (example for role-based access)
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    // Add role checking logic here based on your user model
    // if (ctx.user.role !== 'ADMIN') {
    //   throw new TRPCError({ code: 'FORBIDDEN' });
    // }
    return next({ ctx });
});