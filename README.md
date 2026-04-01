# LeadEnrich AI

A production-ready B2B Lead Enrichment SaaS platform built with Next.js, MongoDB, and the Gemini AI API. 

LeadEnrich AI allows you to pass a company domain, and it instantly scrapes the website, checks deliverability infrastructure (MX & SPF records), and uses an LLM (Gemini) to infer firmographics, technology stacks, lead scores, and actionable insights.

## 🚀 Features

- **Real-Time Web Scraping**: Instantly visits the target domain to extract metadata, social links, and unstructured text using Cheerio.
- **AI-Powered Enrichment**: Uses Google Gemini to analyze unstructured HTML and return highly structured, strict JSON firmographics without hallucinations.
- **Deliverability Checks**: Automatically performs DNS lookups to verify MX and SPF records.
- **SaaS-Grade Authentication**: Implements prefix-based hashed API keys (`sk_live_...`) for secure, fast authentication.
- **Usage Tracking & Rate Limiting**: Tracks every endpoint request to an API Key and enforces monthly usage limits.
- **Premium Developer Dashboard**: Manage API keys and monitor usage limits through a beautifully designed, mobile-responsive glassmorphism UI.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **AI/LLM**: Google Gemini (`@google/generative-ai`)
- **Authentication**: JWT & Bcrypt (Password & API Key Hashing)
- **Styling**: Vanilla CSS with Glassmorphism UI

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jamesguerrier/leadEnrichAI.git
   cd leadEnrichAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Rename `.env.example` to `.env.local` and fill in the required keys:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leadenrich
   
   # Secret for user JWT sessions
   JWT_SECRET=your_jwt_secret_min_32_chars
   
   # Gemini API Key for AI Enrichment
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📖 API Documentation

### **Enrich a Domain**
Returns a comprehensive JSON payload containing firmographics, deliverability stats, and AI-inferred insights.

**Endpoint:**
`POST /api/v1/enrich`

**Headers:**
- `Content-Type: application/json`
- `x-api-key: sk_live_YOUR_GENERATED_KEY`

**Payload:**
```json
{
  "domain": "stripe.com"
}
```

**Success Response (Sample):**
```json
{
  "success": true,
  "data": {
    "domain": "stripe.com",
    "company": "Stripe",
    "enrichedAt": "2026-03-24T12:00:00.000Z",
    "firmographics": {
      "industry": "Financial Services",
      "employeeCount": { "range": "5000-10000", "confidence": 0.8, "source": "ai_inference" }
    },
    "technologyStack": {
      "categories": { }
    },
    "domainIntelligence": {
      "spf": { "value": "v=spf1 include:_spf.google.com ~all", "confidence": 1.0, "source": "verified" }
    },
    "leadScore": {
      "overall": 95,
      "interpretation": "High Fit: Enterprise financial leader"
    }
  },
  "error": null
}
```

## 🚀 Deployment to Vercel

LeadEnrich AI is optimized for [Vercel](https://vercel.com/) and can be deployed with a few clicks.

### **1. Configure Environment Variables**
In your Vercel Dashboard, navigate to **Settings > Environment Variables** and add the following:

- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A long, random string for session security.
- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`).

### **2. Database Access**
Ensure your MongoDB Atlas cluster allows connections from **0.0.0.0/0** (or use Vercel's trusted IPs if on a higher tier) since Vercel utilizes dynamic IP addresses.

### **3. Serverless Timeouts (Hobby Plan)**
- **Hobby Plan**: Standard execution time is limited to **10 seconds**. Some complex enrichments (slow websites + AI analysis) may approach this limit. 
- **Pro Plan**: The project is configured with `export const maxDuration = 60;` to support deeper analysis if you upgrade.

## 📄 License
This project is open-source and available under the MIT License.