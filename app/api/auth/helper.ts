import { verifyToken } from "@/lib/auth";
import { getSessiontoken } from "@/lib/session";
import { User } from "@/type/User";

export default async function getUser(): Promise<User | null> {
    const token = await getSessiontoken();
    if (token === null) return null;
    const decoded = verifyToken(token);
    return decoded ? decoded.user : null;
}