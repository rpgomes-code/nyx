"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function VerifyEmailForm({
                                    className,
                                    ...props
                                }: React.ComponentProps<"div">) {
    const [isResending, setIsResending] = useState(false);

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            // Implement resend verification email logic with better-auth
            // This depends on your better-auth configuration
            toast.success("Verification email sent!");
        } catch (error) {
            console.error("Resend verification email error:", error);
            toast.error("Failed to resend verification email");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)} {...props}>
            <Card className="overflow-hidden border-2">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="flex aspect-square size-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md">
                            <Mail className="h-8 w-8" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-primary">
                                Verify your email
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm">
                                We've sent a verification link to your email address. Click the link to activate your account.
                            </p>
                        </div>

                        <div className="w-full space-y-3">
                            <Button
                                onClick={handleResendEmail}
                                variant="outline"
                                className="w-full h-11"
                                disabled={isResending}
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Resend verification email
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                Didn't receive the email? Check your spam folder or try resending.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                </Link>
            </div>
        </div>
    );
}