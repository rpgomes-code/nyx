import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import {nextCookies} from "better-auth/next-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || process.env.BASE_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
                from: `Nyx <${process.env.RESEND_EMAIL}>`,
                to: user.email,
                subject: "Verify your email address",
                html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>Verify your email</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { 
                  display: inline-block;
                  width: 64px;
                  height: 64px;
                  background: linear-gradient(135deg, #7c3aed, #2563eb);
                  border-radius: 12px;
                  color: white;
                  font-size: 32px;
                  font-weight: bold;
                  line-height: 64px;
                  text-align: center;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #7c3aed, #2563eb);
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 500;
                  margin: 20px 0;
                }
                .footer { margin-top: 30px; font-size: 14px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">N</div>
                  <h1>Welcome to Nyx!</h1>
                </div>
                
                <p>Hi ${user.name},</p>
                
                <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${url}" class="button">Verify Email Address</a>
                </div>
                
                <p>If the button doesn't work, you can also click this link:</p>
                <p><a href="${url}">${url}</a></p>
                
                <div class="footer">
                  <p>This verification link will expire in 24 hours.</p>
                  <p>If you didn't create a Nyx account, you can safely ignore this email.</p>
                </div>
              </div>
            </body>
          </html>
        `,
            });
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID as string,
            clientSecret: process.env.APPLE_CLIENT_SECRET as string,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    trustedOrigins: [
        process.env.BASE_URL || "http://localhost:3000",
    ],
    plugins: [nextCookies()]
});