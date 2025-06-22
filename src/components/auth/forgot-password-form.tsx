"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/lib/validations/auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm({
                                       className,
                                       ...props
                                   }: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ForgotPasswordFormValues) {
        setIsLoading(true);

        try {
            const result = await authClient.forgetPassword({
                email: data.email,
                redirectTo: "/reset-password",
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to send reset email");
                return;
            }

            setIsSubmitted(true);
            toast.success("Password reset email sent!");
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)} {...props}>
                <Card className="overflow-hidden border-2">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="flex aspect-square size-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md">
                                <Mail className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-primary">Check your email</h1>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    We've sent a password reset link to {form.getValues("email")}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-primary hover:underline"
                                >
                                    try again
                                </button>
                            </p>
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

    return (
        <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)} {...props}>
            <Card className="overflow-hidden border-2 pb-0 px-0">
                <CardContent className="p-6 md:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex aspect-square size-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md">
                                    <span className="text-2xl font-bold">N</span>
                                </div>
                                <h1 className="text-2xl font-bold text-primary mt-4">
                                    Forgot your password?
                                </h1>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Enter your email address and we'll send you a reset link
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                                className="h-11"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-11 font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send reset link"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 flex items-center gap-2 border-t">
                    <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        We'll never share your email with anyone else.
                    </p>
                </CardFooter>
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
