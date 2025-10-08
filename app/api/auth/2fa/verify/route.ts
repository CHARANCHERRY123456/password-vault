import { NextResponse, NextRequest } from "next/server";
import speakeasy from 'speakeasy';
import getUser from "../../helper";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

interface VerifyResponse {
    message: string;
    success: boolean;
}

interface ErrorResponse {
    message: string;
}

export async function POST(
    req: NextRequest
): Promise<NextResponse<VerifyResponse | ErrorResponse>> {
    try {
        const curUser = await getUser();
        if (!curUser) {
            return NextResponse.json<ErrorResponse>(
                { message: "user is not available" },
                { status: 401 }
            );
        }

        await connectToDatabase();
        
        const user = await User.findById(curUser.id);
        if (!user) {
            return NextResponse.json<ErrorResponse>(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (!user.twoFactorSecret) {
            return NextResponse.json<ErrorResponse>(
                { message: "2FA not initiated. Please enable 2FA first" },
                { status: 400 }
            );
        }

        if (user.is2FAEnabled) {
            return NextResponse.json<ErrorResponse>(
                { message: "2FA is already enabled" },
                { status: 400 }
            );
        }

        const {token} = await req.json();

        if (!token || token.length !== 6) {
            return NextResponse.json<ErrorResponse>(
                { message: "Invalid token format. Must be 6 digits" },
                { status: 400 }
            );
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2 
        });

        if (!verified) {
            return NextResponse.json<ErrorResponse>(
                { message: "Invalid code. Please try again" },
                { status: 400 }
            );
        }

        user.is2FAEnabled = true;
        await user.save();

        return NextResponse.json<VerifyResponse>({
            message: "2FA enabled successfully",
            success: true
        });

    } catch (error) {
        console.error("2FA verify error:", error);
        return NextResponse.json<ErrorResponse>(
            { message: "Failed to verify 2FA" },
            { status: 500 }
        );
    }
}