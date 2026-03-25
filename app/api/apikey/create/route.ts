import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ApiKey from "@/models/ApiKey";
import User from "@/models/User";
import { getAuthSession } from "@/lib/auth";
import { generateRandomSecret, hashApiKey } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Key name is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user to determine request limit based on plan
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const requestsLimit = user.plan === "pro" ? 50000 : 1000;

    // Generate secret and prefix
    const secret = generateRandomSecret(24); // 48 chars hex
    const prefix = generateRandomSecret(4); // 8 chars hex
    const fullKey = `sk_live_${prefix}.${secret}`;
    const keyHash = hashApiKey(secret);

    // Store in DB
    const apiKey = await ApiKey.create({
      userId: session.userId,
      keyHash,
      keyPrefix: prefix,
      name,
      requestsLimit,
      requestsUsed: 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: apiKey._id,
          name: apiKey.name,
          requestsLimit: apiKey.requestsLimit,
          apiKey: fullKey, // ONLY SHOWN ONCE
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Key create error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
