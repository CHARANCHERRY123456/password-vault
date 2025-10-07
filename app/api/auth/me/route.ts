import { verifyToken } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { getSessiontoken } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const token = await getSessiontoken();
        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }
        
        await connectToDatabase();
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ user: null }, { status: 200 });
        }
        
        return NextResponse.json({ user: decoded.user }, { status: 200 });
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}