import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ApiKey from "@/models/ApiKey";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const keys = await ApiKey.find({ userId: session.userId }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: keys,
        error: null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Key list error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
