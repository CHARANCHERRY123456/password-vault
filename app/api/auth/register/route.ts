import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { hashPassword, signToken } from "../../../../lib/auth";
import { createSessionToken } from "@/lib/session";
import { signupSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validatedData = signupSchema.parse(body);
        const { email, password, name } = validatedData;

        await connectToDatabase();
        
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json(
                { message: "User already exists" }, 
                { status: 400 }
            );
        }
        
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ email, password: hashedPassword , name });
        const token = await signToken({ id: newUser._id, email: newUser.email });

        await createSessionToken(token);

        return NextResponse.json(
            { 
                message: "User created successfully", 
                token,
                user: { id: newUser._id, email: newUser.email, name: newUser.name }
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { message: firstError.message },
                { status: 400 }
            );
        }

        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
