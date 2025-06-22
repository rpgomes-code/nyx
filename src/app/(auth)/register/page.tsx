import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | Nyx",
    description: "Create your Nyx account",
};

export default function RegisterPage() {
    return <RegisterForm />;
}