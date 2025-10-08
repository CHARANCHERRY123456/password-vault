import { NextResponse, NextRequest } from "next/server";
import speakeasy from 'speakeasy';
import QRCode from "qrcode";
import getUser from "../../helper";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// Response types
interface Enable2FAResponse {
    message: string;
    qrCode?: string;
    secret?: string;
}

interface ErrorResponse {
    message: string;
}

export async function POST(
    req: NextRequest
): Promise<NextResponse<Enable2FAResponse | ErrorResponse>> {
    try {
        const curUser = await getUser();
        if (!curUser) {
            return NextResponse.json<ErrorResponse>(
                { message: "Unauthorized" },
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

        if (user.is2FAEnabled) {
            return NextResponse.json<ErrorResponse>(
                { message: "2FA is already enabled" },
                { status: 400 }
            );
        }

        const secret = speakeasy.generateSecret({
            name: `Password Vault (${user.email})`,
            issuer: "Password Vault"
        });

        user.twoFactorSecret = secret.base32;
        await user.save();

        const qrCodeUrl: string = await QRCode.toDataURL(secret.otpauth_url || "");
        
        return NextResponse.json<Enable2FAResponse>({
            message: "2FA setup initiated",
            qrCode: qrCodeUrl,
            secret: secret.base32
        });

    } catch (error) {
        console.error("2FA enable error:", error);
        return NextResponse.json<ErrorResponse>(
            { message: "Failed to enable 2FA" },
            { status: 500 }
        );
    }
}