import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { hashPassword, signToken } from "../../../../lib/auth";
import { createSessionToken } from "@/lib/session";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { email, password , name } = await req.json();
        
        const user = await User.findOne({ email});
        if (user) {
            return NextResponse.json(
                { message: "User already exists" }, 
                { status: 400 }
            );
        }
        
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ email, password: hashedPassword , name });
        const token = await signToken({ id: newUser._id, email: newUser.email });

        createSessionToken(token);

        redirect("/dashboard");
        // return NextResponse.json(
        //     { message: "User created successfully", newUser ,token },
        //     { status: 201 }
        // );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
