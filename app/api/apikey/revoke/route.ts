import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ApiKey from "@/models/ApiKey";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { keyId } = await req.json();
    if (!keyId) {
      return NextResponse.json(
        { success: false, error: "Key ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const apiKey = await ApiKey.findOneAndUpdate(
      { _id: keyId, userId: session.userId },
      { revoked: true },
      { new: true }
    );

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API Key not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { message: "API key revoked successfully" },
        error: null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Key revoke error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
