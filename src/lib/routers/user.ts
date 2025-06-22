import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc';
import prisma from '@/lib/prisma';

export const userRouter = createTRPCRouter({
    // Get current user profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const user = await prisma.user.findUnique({
            where: { id: ctx.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }

        return user;
    }),

    // Update user profile
    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).max(100).optional(),
                image: z.string().url().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return prisma.user.update({
                where: {id: ctx.user.id},
                data: input,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    updatedAt: true,
                },
            });
        }),

    // Get all users (admin only example)
    getAll: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                offset: z.number().min(0).default(0),
            })
        )
        .query(async ({ input }) => {
            const users = await prisma.user.findMany({
                take: input.limit,
                skip: input.offset,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true,
                    emailVerified: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            const total = await prisma.user.count();

            return {
                users,
                total,
                hasMore: input.offset + input.limit < total,
            };
        }),
});