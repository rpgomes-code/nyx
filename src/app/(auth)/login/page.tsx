import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | Nyx",
    description: "Sign in to your Nyx account",
};

export default function LoginPage() {
    return <LoginForm />;
}