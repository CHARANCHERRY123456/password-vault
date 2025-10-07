import { NextResponse } from "next/server";
import { ZodError } from "zod";
import Vault from "@/models/Vault";
import connectToDatabase from "@/lib/mongodb";
import getUser from "../auth/helper";
import { vaultItemSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
    await connectToDatabase();
    try {
        const user = await getUser();  
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        
        // Validate input
        const validatedData = vaultItemSchema.parse(body);
        
        const newVault = await Vault.create({ 
            userId: user.id, 
            ...validatedData 
        });
        
        return NextResponse.json({ message: "Vault item created", vault: newVault }, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ 
                message: "Validation error", 
                errors: error.errors 
            }, { status: 400 });
        }
        console.error("Error in /api/vault:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req : Request) {
    await connectToDatabase();
    try {
        const user = await getUser();  
        const userId = user?.id;
                
        const {search} = Object.fromEntries(new URL(req.url).searchParams);
        const query: Record<string, unknown> = {userId};
        if(search) {
            query.title = {$regex : search , $options : "i"}
        }
        const vaultItems = await Vault.find(query).sort({updatedAt : -1});
        return NextResponse.json({vaultItems});
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}