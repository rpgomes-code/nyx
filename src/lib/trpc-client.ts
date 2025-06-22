import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/lib/routers/root';

export const trpc = createTRPCReact<AppRouter>();