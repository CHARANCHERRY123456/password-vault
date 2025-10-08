import { verifyToken } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { getSessiontoken } from "@/lib/session";
import User from "@/models/User";
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
        
        // Fetch full user details including 2FA status
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }
        
        return NextResponse.json({ 
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                is2FAEnabled: user.is2FAEnabled || false
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}