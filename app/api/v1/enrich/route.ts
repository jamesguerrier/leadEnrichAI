import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { trackUsage } from "@/lib/usage";
import axios from "axios";
import * as cheerio from "cheerio";
import { headers } from "next/headers";
import dns from "dns";
import { promisify } from "util";
import ApiKey from "@/models/ApiKey";
import { hashApiKey } from "@/lib/hash";
import { isRateLimited } from "@/lib/rateLimit";
import { GoogleGenerativeAI } from "@google/generative-ai";

const resolveMx = promisify(dns.resolveMx);

// Vercel serverless configuration
// Note: Hobby plan is limited to 10s, Pro can go up to 300s
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const startTime = Date.now();
  const headerList = await headers();
  const apiKeyHeader = headerList.get("x-api-key");
  const ip = headerList.get("x-forwarded-for") || "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  if (!apiKeyHeader) {
    return NextResponse.json({ success: false, data: null, error: "Missing API Key" }, { status: 401 });
  }

  const parts = apiKeyHeader.split(".");
  if (parts.length !== 2 || !parts[0].startsWith("sk_live_")) {
    return NextResponse.json({ success: false, data: null, error: "Invalid API Key format" }, { status: 403 });
  }

  const secret = parts[1];
  const keyHash = hashApiKey(secret);

  // We explicitly declare apiKeyId to use it throughout the endpoint
  let apiKeyId: string | null = null;

  try {
    await dbConnect();

    // Authenticate the API Key
    const apiKey = await ApiKey.findOne({ keyHash, revoked: false });

    if (!apiKey) {
      return NextResponse.json({ success: false, data: null, error: "Invalid or Revoked API Key" }, { status: 403 });
    }

    if (apiKey.requestsUsed >= apiKey.requestsLimit) {
      return NextResponse.json({ success: false, data: null, error: "Monthly request limit exceeded" }, { status: 429 });
    }

    apiKeyId = apiKey._id.toString();

    if (isRateLimited(apiKeyId!)) {
      return NextResponse.json({ success: false, data: null, error: "Too many requests. Please slow down." }, { status: 429 });
    }

    const { email, domain: inputDomain } = await req.json();

    if (!email && !inputDomain) {
      return errorResponse(apiKeyId, "Email or domain is required", 400);
    }

    let domain = inputDomain;
    if (email && !domain) {
      domain = email.split("@")[1];
    }

    if (!domain) {
      return errorResponse(apiKeyId, "Invalid input", 400);
    }

    // Standardize domain
    domain = domain.toLowerCase().trim();

    // 1. MX Records lookup (Email validation angle)
    let mxRecords: dns.MxRecord[] = [];
    try {
      mxRecords = await resolveMx(domain);
    } catch (e) {
      // Domain might not have MX records or doesn't exist
    }

    // 2. Web Scraping with Timeout (Enrichment)
    interface EnrichmentData {
      companyName: string | null;
      title: string | null;
      description: string | null;
      socials: {
        linkedin: string | null;
        twitter: string | null;
        facebook: string | null;
      };
      favicon: string;
    }

    let enrichmentData: EnrichmentData = {
      companyName: null,
      title: null,
      description: null,
      socials: {
        linkedin: null,
        twitter: null,
        facebook: null,
      },
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    };

    // Attempt scraping with HTTPS first, then fallback to HTTP
    const protocols = ["https", "http"];
    for (const protocol of protocols) {
      try {
        const response = await axios.get(`${protocol}://${domain}`, {
          timeout: 6000, 
          headers: {
            "User-Agent": "LeadEnrichmentBot/1.0",
          },
        });

        const $ = cheerio.load(response.data);

        enrichmentData.title = $("title").text().trim() || null;
        enrichmentData.description =
          $('meta[name="description"]').attr("content") ||
          $('meta[property="og:description"]').attr("content") ||
          null;

        const ogSiteName = $('meta[property="og:site_name"]').attr("content");
        enrichmentData.companyName = ogSiteName || enrichmentData.title?.split("|")[0]?.split("-")[0]?.trim() || null;

        $('a[href*="linkedin.com/company"]').each((_, el) => {
          const href = $(el).attr("href");
          if (href) enrichmentData.socials.linkedin = href;
        });
        $('a[href*="twitter.com/"]').each((_, el) => {
          const href = $(el).attr("href");
          if (href) enrichmentData.socials.twitter = href;
        });
        $('a[href*="facebook.com/"]').each((_, el) => {
          const href = $(el).attr("href");
          if (href) enrichmentData.socials.facebook = href;
        });
        
        // If we got data, break out of protocol loop
        if (enrichmentData.title) break;
      } catch (scrapingError: any) {
        console.error(`${protocol.toUpperCase()} scraping failed for ${domain}:`, scrapingError.message);
      }
    }

    const rawScrapedData = {
      domain,
      company: enrichmentData.companyName,
      metadata: {
        title: enrichmentData.title,
        description: enrichmentData.description,
      },
      socials: enrichmentData.socials,
      favicon: enrichmentData.favicon,
      deliverability: {
        hasMxRecords: mxRecords.length > 0,
        mxRecords: mxRecords.map(r => r.exchange),
      },
    };

    let resultData: any = rawScrapedData;

    try {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey) {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-3-flash-preview",
          generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `You are an expert in B2B data quality and API design. Your task is to analyze company data and return a clean, trustworthy, market-ready enriched JSON response.

INPUT DATA:
${JSON.stringify(rawScrapedData, null, 2)}

CRITICAL RULES:
1. ONLY return verified data or highly confident inferences. DO NOT guess or hallucinate.
2. Fields with "source": "verified" get confidence: 1.0 (e.g., DNS, MX, SSL, Headers).
3. Fields from basic AI inference (e.g., industry, revenue range) get "source": "ai_inference" and confidence <= 0.7.
4. REMOVE contacts entirely. Never invent people.
5. REMOVE historicalTrends entirely. Never invent historical growth.
6. Reduce leadScore strictly to a single overall numeric score and interpretation. No components breakdown.
7. Reduce actionableInsights strictly to painPoints with a required "evidenceUrl". If you cannot provide a valid evidenceUrl, DO NOT return the insight.
8. REMOVE sslExpiry and sslIssuer unless you can return accurate verifiable data.
9. Return ONLY valid JSON matching the exact schema below. No explanation.

OUTPUT FORMAT (STRICT JSON):
{
  "domain": "string",
  "company": "string",
  "enrichedAt": "${new Date().toISOString()}",

  "firmographics": {
    "industry": "string",
    "industryVertical": "string",
    "employeeCount": { "range": "string", "exact": null, "confidence": 0, "source": "ai_inference" },
    "annualRevenue": { "range": "string", "currency": "string", "confidence": 0, "source": "ai_inference" },
    "foundedYear": { "value": null, "confidence": 0, "source": "ai_inference" },
    "headquarters": { "city": "string", "state": "string", "country": "string", "confidence": 0, "source": "ai_inference" }
  },

  "dataFreshness": {
    "firmographics": "${new Date().toISOString()}",
    "technologyStack": "${new Date().toISOString()}",
    "domainIntelligence": "${new Date().toISOString()}"
  },

  "metadata": { "title": "string", "description": "string", "logoUrl": "string", "favicon": "string" },

  "socials": { "linkedin": "string or null", "twitter": "string or null", "facebook": "string or null", "crunchbase": "string or null" },

  "technologyStack": {
    "categories": {
      "categoryName": [ { "name": "string", "confidence": 0, "detectedVia": "string", "source": "ai_inference" } ]
    },
    "totalDetected": 0
  },

  "domainIntelligence": {
    "mxRecords": ["string"],
    "spf": { "value": "string", "confidence": 0, "source": "verified" },
    "hostingProvider": { "value": "string", "confidence": 0, "source": "ai_inference" },
    "subdomainsDiscovered": ["string"]
  },

  "leadScore": {
    "overall": 0,
    "interpretation": "string",
    "confidence": 0
  },

  "actionableInsights": {
    "painPoints": [ { "title": "string", "evidence": "string", "evidenceUrl": "string", "relevance": "string", "source": "ai_inference" } ],
    "opportunities": [ { "title": "string", "impact": "string", "source": "ai_inference" } ]
  },

  "deliverability": {
    "hasMxRecords": true,
    "mxRecords": ["string"],
    "emailRiskScore": { "value": 0, "confidence": 0, "source": "ai_inference" },
    "catchAll": { "value": false, "confidence": 0, "source": "ai_inference" }
  },

  "confidenceSummary": { "overall": 0, "verifiedDataPoints": 0, "aiGeneratedDataPoints": 0 }
}`;

        const aiResponse = await model.generateContent(prompt);
        let text = aiResponse.response.text();
        
        // Robust JSON parsing (handles markdown blocks)
        try {
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
          const cleanJson = (jsonMatch[1] || text).trim();
          resultData = JSON.parse(cleanJson);
        } catch (parseError) {
          console.error("Failed to parse AI JSON response:", parseError);
          // Fallback to raw data if parsing fails
        }
      }
    } catch (llmError) {
      console.error("LLM Enrichment failed, returning raw scraped data:", llmError);
    }

    // Log usage
    await trackUsage({
      apiKeyId: apiKeyId!,
      endpoint: "/api/v1/enrich",
      statusCode: 200,
      responseTime: Date.now() - startTime,
      ip: ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      data: resultData,
      error: null,
    });
  } catch (error: any) {
    console.error("Enrichment API error:", error);
    
    const duration = Date.now() - startTime;
    if (apiKeyId) {
      await trackUsage({
        apiKeyId,
        endpoint: "/api/v1/enrich",
        statusCode: 500,
        responseTime: duration,
        ip: ip,
        userAgent,
      });
    }

    return NextResponse.json(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }

  async function errorResponse(keyId: string | null, message: string, status: number) {
    const duration = Date.now() - startTime;
    if (keyId) {
      await trackUsage({
        apiKeyId: keyId,
        endpoint: "/api/v1/enrich",
        statusCode: status,
        responseTime: duration,
        ip: ip,
        userAgent,
      });
    }

    return NextResponse.json(
      { success: false, data: null, error: message },
      { status }
    );
  }
}
