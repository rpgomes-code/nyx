import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/lib/routers/root';

// Export router type helpers
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Export specific endpoint types for easy use
export type UserGetAllInput = RouterInputs['user']['getAll'];
export type UserGetAllOutput = RouterOutputs['user']['getAll'];
export type User = UserGetAllOutput['users'][0];

export type UserUpdateProfileInput = RouterInputs['user']['updateProfile'];
export type UserProfileOutput = RouterOutputs['user']['getProfile'];

export type AuthSessionOutput = RouterOutputs['auth']['getSession'];
export type AuthSessionsOutput = RouterOutputs['auth']['getSessions'];