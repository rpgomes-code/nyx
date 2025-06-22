"use client";

import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client"

type AuthContextType = {
    user: any;
    session: any;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending: isLoading } = authClient.useSession();

    return (
        <AuthContext.Provider
            value={{
                user: session?.user || null,
                session: session || null,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}