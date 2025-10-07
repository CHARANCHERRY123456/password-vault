import { NextResponse } from "next/server";
import Vault from "@/models/Vault";
import connectToDatabase from "@/lib/mongodb";
import getUser from "@/app/api/auth/helper";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const vaultItem = await Vault.findOne({ _id: params.id, userId: user.id });

        if (!vaultItem) {
            return NextResponse.json({ message: "Vault item not found" }, { status: 404 });
        }

        return NextResponse.json({ vault: vaultItem });
    } catch (error) {
        console.error("Error in GET /api/vault/[id]:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, password, url, notes, tags } = await req.json();

        const updatedVault = await Vault.findOneAndUpdate(
            { _id: params.id, userId: user.id },
            { title, password, url, notes, tags, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedVault) {
            return NextResponse.json({ message: "Vault item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Vault item updated", vault: updatedVault }, { status: 200 });
    } catch (error) {
        console.error("Error in PUT /api/vault/[id]:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const deletedVault = await Vault.findOneAndDelete({
            _id: params.id,
            userId: user.id
        });

        if (!deletedVault) {
            return NextResponse.json({ message: "Vault item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Vault item deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE /api/vault/[id]:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
