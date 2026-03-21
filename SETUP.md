# NeuralRoute — Setup Guide

AI API reseller SaaS built on Next.js 14 + OpenRouter + Stripe + n8n.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend + API | Next.js 14 (App Router) |
| AI Models | OpenRouter (200+ models) |
| Payments | Stripe |
| Automation | n8n |
| Deploy | Vercel |
| Styles | Tailwind CSS + custom CSS |

---

## Project Structure

```
app/
  page.tsx              ← Landing page
  pricing/page.tsx      ← 3-tier pricing
  chat/page.tsx         ← Streaming chat UI
  dashboard/page.tsx    ← KPIs + analytics
  api-keys/page.tsx     ← Sub-key management
  n8n/page.tsx          ← n8n workflow builder
  api/
    chat/route.ts       ← OpenRouter streaming proxy
components/
  Nav.tsx               ← Site navigation
```

---

## Step 1 — Local Setup

```bash
# Clone / copy files into your project
npm install

# Copy env template
cp .env.example .env.local

# Fill in your keys (see below)
# Then run:
npm run dev
```

Open http://localhost:3000

---

## Step 2 — Get Your Keys

### OpenRouter
1. Go to https://openrouter.ai/settings/keys
2. Create a new API key → copy to `OPENROUTER_API_KEY`
3. Go to https://openrouter.ai/settings/management-keys
4. Create a management key → copy to `OPENROUTER_MANAGEMENT_KEY`

### Stripe
1. Go to https://dashboard.stripe.com/apikeys
2. Copy secret key → `STRIPE_SECRET_KEY`
3. Create 3 products: $29, $79, $299
4. Go to Webhooks → Add endpoint → your n8n URL
5. Copy signing secret → `STRIPE_WEBHOOK_SECRET`
6. Subscribe to: `checkout.session.completed`, `customer.subscription.deleted`

---

## Step 3 — Deploy to Vercel

```bash
# Push to GitHub, then:
# 1. Go to vercel.com → Import project
# 2. Add all env variables from .env.example
# 3. Deploy
```

Or via CLI:
```bash
npm i -g vercel
vercel --prod
```

---

## Step 4 — Import n8n Workflows

1. Open your n8n instance (n8n.cloud or self-hosted)
2. Go to the **n8n Builds** tab in the app
3. Click **Copy JSON** on any workflow
4. In n8n: New Workflow → ⋯ menu → Import from JSON → Paste
5. Add credentials: OpenRouter API key, Stripe, Email service
6. Set your env variables in n8n settings
7. **Activate** the workflow

### The 4 Workflows:
| Workflow | Trigger | What it does |
|---|---|---|
| Customer Onboarding | Stripe checkout | Provision sub-key + send welcome email |
| Usage Alert | Hourly cron | Email customers at 80% / 95% cap |
| Monthly Invoice | 1st of month | Generate + email usage invoices |
| Churn Prevention | Stripe cancellation | Save sequence + revoke key |

---

## Step 5 — Wire Real Sub-Key Provisioning

The API Keys page simulates provisioning. To make it real:

Create `app/api/keys/create/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { label, creditLimit } = await req.json();

  const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_MANAGEMENT_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      label,
      limit: creditLimit,  // in USD
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
```

Then in `app/api-keys/page.tsx`, replace the `setTimeout` simulation with:
```typescript
const res = await fetch("/api/keys/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ label: form.name, creditLimit: parseFloat(form.creditLimit) }),
});
const data = await res.json();
// data.key is the new sub-key
```

---

## Architecture Flow

```
Customer signs up
       ↓
Stripe checkout ($29/$79/$299)
       ↓
Stripe webhook → n8n
       ↓
n8n calls OpenRouter Management API
       ↓
Sub-key created with credit limit
       ↓
Email sent to customer with API key
       ↓
Customer uses your API endpoint
       ↓
Your Next.js proxy → OpenRouter
       ↓
You keep the margin 💰
```

---

## Margin Calculator

| Plan | You charge | OpenRouter costs | Margin |
|---|---|---|---|
| Starter | $29 | ~$12 | **58%** |
| Pro | $79 | ~$35 | **56%** |
| Enterprise | $299 | ~$110 | **63%** |

---

## Support

- OpenRouter docs: https://openrouter.ai/docs
- n8n docs: https://docs.n8n.io
- Stripe docs: https://stripe.com/docs
- Next.js docs: https://nextjs.org/docs
