import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { verifyPassword, signToken } from "../../../../lib/auth";
import { createSessionToken } from "@/lib/session";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request body using Zod schema
        const validatedData = loginSchema.parse(body);
        const { email, password } = validatedData;

        await connectToDatabase();
        
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        
        const token = await signToken({ id: user._id, email: user.email });
        await createSessionToken(token);
        
        return NextResponse.json(
            { 
                message: "Login successful", 
                token,
                user: { id: user._id, email: user.email, name: user.name }
            },
            { status: 200 }
        );
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { message: firstError.message },
                { status: 400 }
            );
        }

        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
