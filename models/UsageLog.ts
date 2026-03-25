import mongoose, { Schema, model, models } from "mongoose";

const UsageLogSchema = new Schema(
  {
    apiKeyId: {
      type: Schema.Types.ObjectId,
      ref: "ApiKey",
      required: true,
    },
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    endpoint: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number, // ms
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false } // We don't need updatedAt for logs
);

// Indexes
UsageLogSchema.index({ apiKeyId: 1, createdAt: -1 });

const UsageLog = models.UsageLog || model("UsageLog", UsageLogSchema);
export default UsageLog;
