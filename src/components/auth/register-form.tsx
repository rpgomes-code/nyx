﻿"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/lib/validations/auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentProps<"div">) {
    // Form visibility states
    const [step, setStep] = useState(1);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Initialize form with react-hook-form and zod validation
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
        mode: "onChange",
    });

    // Check if the current step is valid
    const isStepValid = (stepNumber: number) => {
        const { name, email, password, confirmPassword, agreeToTerms } = form.getValues();
        const { errors } = form.formState;

        switch (stepNumber) {
            case 1:
                // Check if basic info fields are valid
                return (
                    name !== "" &&
                    email !== "" &&
                    !errors.name &&
                    !errors.email
                );
            case 2:
                // Check if password fields are valid and terms are agreed
                return (password !== "" &&
                    confirmPassword !== "" && agreeToTerms && !errors.password && !errors.confirmPassword && !errors.agreeToTerms);
            default:
                return true;
        }
    };

    // Move to the next step
    const handleNextStep = () => {
        if (step < 3 && isStepValid(step)) {
            setStep(step + 1);
        } else {
            // Trigger validation to show errors
            form.trigger();
        }
    };

    // Move to previous step
    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Form submission
    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true);

        try {
            const result = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to create account");
                return;
            }

            toast.success("Account created successfully!");

            // Check if email verification is required
            if (result.data.user?.emailVerified === false) {
                toast.info("Please check your email to verify your account");
                router.push("/verify-email");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSocialSignup = async (provider: "google" | "github" | "discord") => {
        try {
            setIsLoading(true);
            await authClient.signIn.social({
                provider,
                callbackURL: "/dashboard",
            });
        } catch (error) {
            console.error(`${provider} signup error:`, error);
            toast.error(`Failed to sign up with ${provider}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={cn("flex flex-col gap-6 max-w-md mx-auto", className)}
            {...props}
        >
            <Card className="overflow-hidden border-2 pb-0 px-0">
                <CardContent className="p-6 md:p-8 pb-2 md:pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                {/* Form header - always visible */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex justify-center">
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <div className="flex aspect-square size-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg transition-shadow">
                                                <span className="text-2xl font-bold">N</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <h1 className="text-2xl font-bold text-primary mt-4">
                                        Join Nyx
                                    </h1>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Create your account to get started
                                    </p>
                                </div>

                                {/* Step indicator */}
                                <div className="flex justify-center space-x-2 mb-2">
                                    {[1, 2, 3].map((stepNumber) => (
                                        <div
                                            key={stepNumber}
                                            className={`h-2 rounded-full transition-all duration-200 ${
                                                stepNumber === step
                                                    ? "w-8 bg-primary"
                                                    : stepNumber < step
                                                        ? "w-8 bg-primary/60"
                                                        : "w-8 bg-muted"
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Step 1: Basic Information */}
                                {step === 1 && (
                                    <div className="grid gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="John Doe"
                                                            autoComplete="name"
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

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
                                    </div>
                                )}

                                {/* Step 2: Password Setup */}
                                {step === 2 && (
                                    <div className="grid gap-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type={isPasswordVisible ? "text" : "password"}
                                                                autoComplete="new-password"
                                                                className="h-11 pr-10"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                                                                onClick={() =>
                                                                    setIsPasswordVisible(!isPasswordVisible)
                                                                }
                                                                aria-label={
                                                                    isPasswordVisible
                                                                        ? "Hide password"
                                                                        : "Show password"
                                                                }
                                                            >
                                                                {isPasswordVisible ? (
                                                                    <EyeOff size={18} />
                                                                ) : (
                                                                    <Eye size={18} />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Password must be at least 8 characters with
                                                        uppercase, lowercase, number and special character
                                                    </p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type={
                                                                    isConfirmPasswordVisible ? "text" : "password"
                                                                }
                                                                autoComplete="new-password"
                                                                className="h-11 pr-10"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                                                                onClick={() =>
                                                                    setIsConfirmPasswordVisible(
                                                                        !isConfirmPasswordVisible
                                                                    )
                                                                }
                                                                aria-label={
                                                                    isConfirmPasswordVisible
                                                                        ? "Hide password"
                                                                        : "Show password"
                                                                }
                                                            >
                                                                {isConfirmPasswordVisible ? (
                                                                    <EyeOff size={18} />
                                                                ) : (
                                                                    <Eye size={18} />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="agreeToTerms"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                                            I agree to the{" "}
                                                            <Link
                                                                href="/terms"
                                                                className="text-primary hover:underline"
                                                            >
                                                                Terms of Service
                                                            </Link>{" "}
                                                            and{" "}
                                                            <Link
                                                                href="/privacy"
                                                                className="text-primary hover:underline"
                                                            >
                                                                Privacy Policy
                                                            </Link>
                                                        </FormLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Step 3: Social Connections */}
                                {step === 3 && (
                                    <div className="grid gap-6">
                                        <div className="text-center">
                                            <h2 className="text-lg font-medium">
                                                Connect your accounts
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Optional: Sign up faster with your existing accounts
                                            </p>
                                        </div>

                                        <div className="grid gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isLoading}
                                                className="h-11 border hover:border-2 transition-colors flex items-center justify-center gap-2 hover:border-[#4285F4] dark:hover:border-[#4285F4] cursor-pointer disabled:cursor-not-allowed"
                                                onClick={() => handleSocialSignup("google")}
                                                aria-label="Sign up with Google"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path
                                                        fill="currentColor"
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    />
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    />
                                                    <path
                                                        fill="currentColor"
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    />
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    />
                                                </svg>
                                                <span>Continue with Google</span>
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isLoading}
                                                className="h-11 border hover:border-2 transition-colors flex items-center justify-center gap-2 hover:border-[#333] dark:hover:border-[#f6f8fa] cursor-pointer disabled:cursor-not-allowed"
                                                onClick={() => handleSocialSignup("github")}
                                                aria-label="Sign up with GitHub"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                </svg>
                                                <span>Continue with GitHub</span>
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isLoading}
                                                className="h-11 border hover:border-2 transition-colors flex items-center justify-center gap-2 hover:border-[#5865F2] dark:hover:border-[#5865F2] cursor-pointer disabled:cursor-not-allowed"
                                                onClick={() => handleSocialSignup("discord")}
                                                aria-label="Sign up with Discord"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                                                </svg>
                                                <span>Continue with Discord</span>
                                            </Button>
                                        </div>

                                        <div className="text-center py-2">
                                            <p className="text-sm text-muted-foreground">
                                                You can also connect these accounts later
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation buttons */}
                                <div className="flex justify-between gap-4 mt-2">
                                    {step > 1 ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={handlePrevStep}
                                            disabled={isLoading}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                    ) : (
                                        <div className="flex-1"></div>
                                    )}

                                    {step < 3 ? (
                                        <Button
                                            type="button"
                                            className="flex-1"
                                            onClick={handleNextStep}
                                            disabled={isLoading || !isStepValid(step)}
                                        >
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Creating account..." : "Create account"}
                                        </Button>
                                    )}
                                </div>

                                {/* Sign in link */}
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="text-primary font-medium hover:underline cursor-pointer"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 flex items-center gap-2 border-t">
                    <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Your data is protected with enterprise-grade encryption and security protocols.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}