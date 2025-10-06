import { verifyToken } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { getSessiontoken } from "@/lib/session";

export async function getMe() {
    const token = await getSessiontoken();
    if (!token) return null;
    await connectToDatabase();
    const decoded = await verifyToken(token);
    if (!decoded) return null;
    return decoded.user;
}