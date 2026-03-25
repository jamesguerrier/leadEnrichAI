import mongoose, { Schema, model, models } from "mongoose";

const ApiKeySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    keyHash: {
      type: String,
      required: true,
      unique: true,
    },
    keyPrefix: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    requestsUsed: {
      type: Number,
      default: 0,
    },
    requestsLimit: {
      type: Number,
      default: 1000,
    },
    lastUsedAt: {
      type: Date,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
ApiKeySchema.index({ userId: 1 });

const ApiKey = models.ApiKey || model("ApiKey", ApiKeySchema);
export default ApiKey;
