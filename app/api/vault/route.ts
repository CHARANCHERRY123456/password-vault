import { NextResponse } from "next/server";
import Vault from "@/models/Vault";

import connectToDatabase from "@/lib/mongodb";
import getUser from "../auth/helper";

export async function POST(req: Request) {
    await connectToDatabase();
    try {

        const user = await getUser();  
        const userId = user?.id;

        const { title, password, url, notes, tags } = await req.json();
        const newVault = await Vault.create({ userId, title, password, url, notes, tags });
        return NextResponse.json({ message: "Vault item created", vault: newVault }, { status: 201 });
    }catch (error) {
        console.error("Error in /api/auth/vault:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req : Request) {
    await connectToDatabase();
    try {
        const user = await getUser();  
        const userId = user?.id;
                
        const {search} = Object.fromEntries(new URL(req.url).searchParams);
        const query : any = {userId};
        if(search) {
            query.title = {$regex : search , $options : "i"}
        }
        const vaultItems = await Vault.find(query).sort({updatedAt : -1});
        return NextResponse.json({vaultItems});
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}