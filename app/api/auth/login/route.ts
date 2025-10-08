import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import speakeasy from "speakeasy";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { verifyPassword, signToken } from "../../../../lib/auth";
import { createSessionToken } from "@/lib/session";
import { loginSchema } from "@/lib/validations/auth";

interface LoginRequest {
    email: string;
    password: string;
    twoFactorCode?: string;
}

interface LoginResponse {
    message: string;
    requires2FA?: boolean;
    email?: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name?: string;
    };
}

interface ErrorResponse {
    message: string;
}

export async function POST(
    req: NextRequest
): Promise<NextResponse<LoginResponse | ErrorResponse>> {
    try {
        const body: LoginRequest = await req.json();
        const { email, password, twoFactorCode } = body;

        // Validate email and password
        const validatedData = loginSchema.parse({ email, password });

        await connectToDatabase();
        
        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            return NextResponse.json<ErrorResponse>(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        
        const isValidPassword = await verifyPassword(validatedData.password, user.password);
        if (!isValidPassword) {
            return NextResponse.json<ErrorResponse>(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (user.is2FAEnabled) {
            if (!twoFactorCode) {
                return NextResponse.json<LoginResponse>({
                    message: "2FA required",
                    requires2FA: true,
                    email: user.email,
                }, { status: 200 });
            }

            if (twoFactorCode.length !== 6) {
                return NextResponse.json<ErrorResponse>(
                    { message: "Invalid 2FA code format" },
                    { status: 400 }
                );
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret!,
                encoding: 'base32',
                token: twoFactorCode,
                window: 2
            });

            if (!verified) {
                return NextResponse.json<ErrorResponse>(
                    { message: "Invalid 2FA code" },
                    { status: 401 }
                );
            }
        }
        
        const token = await signToken({ id: user._id, email: user.email });
        await createSessionToken(token);
        
        return NextResponse.json<LoginResponse>(
            { 
                message: "Login successful", 
                token,
                user: { id: user._id, email: user.email, name: user.name }
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json<ErrorResponse>(
                { message: firstError.message },
                { status: 400 }
            );
        }

        console.error("Login error:", error);
        return NextResponse.json<ErrorResponse>(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
