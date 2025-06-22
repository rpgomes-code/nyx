import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/lib/trpc';
import prisma from '@/lib/prisma';

export const authRouter = createTRPCRouter({
    // Get current session
    getSession: publicProcedure.query(async ({ ctx }) => {
        return ctx.session;
    }),

    // Get user sessions
    getSessions: protectedProcedure.query(async ({ ctx }) => {
        return prisma.session.findMany({
            where: {userId: ctx.user.id},
            select: {
                id: true,
                createdAt: true,
                expiresAt: true,
                ipAddress: true,
                userAgent: true,
            },
            orderBy: {createdAt: 'desc'},
        });
    }),
});