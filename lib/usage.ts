import dbConnect from "./mongodb";
import ApiKey from "@/models/ApiKey";
import UsageLog from "@/models/UsageLog";
import { v4 as uuidv4 } from "uuid";

interface LogUsageParams {
  apiKeyId: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  ip?: string;
  userAgent?: string;
}

/**
 * Log a request and update API key usage statistics
 */
export async function trackUsage({
  apiKeyId,
  endpoint,
  statusCode,
  responseTime,
  ip,
  userAgent,
}: LogUsageParams) {
  try {
    await dbConnect();

    const requestId = uuidv4();

    // 1. Create the usage log entry
    const logPromise = UsageLog.create({
      apiKeyId,
      requestId,
      ip,
      userAgent,
      endpoint,
      statusCode,
      responseTime,
    });

    // 2. Increment usage counter and update lastUsedAt on the API key
    // We only increment if the request was successful or rate limited (optional strategy)
    // For now, let's increment for all successful (2xx) and client error (4xx) requests
    const updatePromise = ApiKey.findByIdAndUpdate(apiKeyId, {
      $inc: { requestsUsed: 1 },
      $set: { lastUsedAt: new Date() },
    });

    await Promise.all([logPromise, updatePromise]);

    return requestId;
  } catch (error) {
    console.error("Failed to track usage:", error);
    return null;
  }
}
