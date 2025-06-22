import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password | Nyx",
    description: "Reset your Nyx account password",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}