﻿import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify Email | Nyx",
    description: "Verify your email address",
};

export default function VerifyEmailPage() {
    return <VerifyEmailForm />;
}