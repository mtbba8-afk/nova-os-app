"use client";
import { useState } from "react";
import { Copy, Check, Workflow, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const ENV_VARS = [
  { key: "OPENROUTER_API_KEY", desc: "Your main OpenRouter API key", where: "openrouter.ai/settings/keys" },
  { key: "OPENROUTER_MANAGEMENT_KEY", desc: "Management key for provisioning sub-keys", where: "openrouter.ai/settings/management-keys" },
  { key: "STRIPE_SECRET_KEY", desc: "Stripe secret key (sk_live_...)", where: "dashboard.stripe.com/apikeys" },
  { key: "STRIPE_WEBHOOK_SECRET", desc: "Webhook signing secret (whsec_...)", where: "dashboard.stripe.com/webhooks" },
  { key: "N8N_WEBHOOK_URL", desc: "Your n8n instance base URL", where: "your-n8n.cloud" },
  { key: "NEXT_PUBLIC_SITE_URL", desc: "Your deployed site URL", where: "vercel.com/dashboard" },
];

const workflows = [
  {
    id: "onboarding",
    name: "Customer Onboarding",
    trigger: "Stripe checkout.session.completed",
    desc: "When a customer pays, automatically provision their OpenRouter sub-key with their plan's credit limit and email it to them.",
    steps: [
      "Stripe Webhook trigger",
      "Extract customer email + plan from session",
      "Call OpenRouter Management API → create sub-key with credit limit",
      "Send email with API key + docs link",
      "Log to Google Sheets / Airtable",
    ],
    json: JSON.stringify({
      name: "NeuralRoute — Customer Onboarding",
      nodes: [
        { name: "Stripe Webhook", type: "n8n-nodes-base.webhook", parameters: { path: "stripe-onboard", httpMethod: "POST" } },
        { name: "Extract Plan", type: "n8n-nodes-base.code", parameters: { jsCode: "const session = $input.first().json.data.object;\nconst email = session.customer_email;\nconst amount = session.amount_total / 100;\nconst plan = amount >= 299 ? 'enterprise' : amount >= 79 ? 'pro' : 'starter';\nconst creditLimit = { starter: 15, pro: 45, enterprise: 175 }[plan];\nreturn [{ email, plan, creditLimit }];" } },
        { name: "OpenRouter Create Key", type: "n8n-nodes-base.httpRequest", parameters: { url: "https://openrouter.ai/api/v1/auth/key", method: "POST", headers: { Authorization: "Bearer {{ $env.OPENROUTER_MANAGEMENT_KEY }}" }, body: { limit: "={{ $json.creditLimit }}", label: "={{ $json.email }}" } } },
        { name: "Send Welcome Email", type: "n8n-nodes-base.emailSend", parameters: { toEmail: "={{ $('Extract Plan').item.json.email }}", subject: "Your NeuralRoute API Key is Ready 🚀", text: "Your API key: {{ $json.key }}\n\nDocs: https://your-site.com/docs\n\nCredit limit: ${{ $('Extract Plan').item.json.creditLimit }}" } },
      ],
      connections: { "Stripe Webhook": { main: [["Extract Plan"]] }, "Extract Plan": { main: [["OpenRouter Create Key"]] }, "OpenRouter Create Key": { main: [["Send Welcome Email"]] } },
    }, null, 2),
  },
  {
    id: "usage-alert",
    name: "Usage Alert",
    trigger: "Scheduled — every hour",
    desc: "Poll your customers' key usage every hour. When a key hits 80% of its limit, send a heads-up email and optionally upsell to a higher plan.",
    steps: [
      "Cron trigger (every 1 hour)",
      "Fetch all sub-key usage from OpenRouter",
      "Filter keys > 80% utilized",
      "For each: send usage alert email",
      "Optionally: send upsell if > 95%",
    ],
    json: JSON.stringify({
      name: "NeuralRoute — Usage Alert",
      nodes: [
        { name: "Hourly Cron", type: "n8n-nodes-base.scheduleTrigger", parameters: { rule: { interval: [{ field: "hours", minutesInterval: 1 }] } } },
        { name: "Fetch Keys", type: "n8n-nodes-base.httpRequest", parameters: { url: "https://openrouter.ai/api/v1/auth/keys", method: "GET", headers: { Authorization: "Bearer {{ $env.OPENROUTER_MANAGEMENT_KEY }}" } } },
        { name: "Filter Near-Limit", type: "n8n-nodes-base.code", parameters: { jsCode: "return $input.all().filter(k => k.json.usage / k.json.limit > 0.8);" } },
        { name: "Send Alert", type: "n8n-nodes-base.emailSend", parameters: { subject: "⚠️ You're at {{ Math.round($json.usage / $json.limit * 100) }}% of your credit limit" } },
      ],
    }, null, 2),
  },
  {
    id: "invoice",
    name: "Monthly Invoice",
    trigger: "Scheduled — 1st of month",
    desc: "On the first of each month, pull usage data and send a PDF invoice to each active customer.",
    steps: [
      "Cron trigger (1st of month at 9am)",
      "Fetch billing period usage per key",
      "Generate invoice PDF",
      "Email to customer with breakdown",
      "Archive in Google Drive",
    ],
    json: JSON.stringify({
      name: "NeuralRoute — Monthly Invoice",
      nodes: [
        { name: "Monthly Cron", type: "n8n-nodes-base.scheduleTrigger", parameters: { rule: { interval: [{ field: "months", atDay: 1 }] } } },
        { name: "Fetch Usage", type: "n8n-nodes-base.httpRequest", parameters: { url: "https://openrouter.ai/api/v1/auth/keys", method: "GET" } },
        { name: "Build Invoice", type: "n8n-nodes-base.code", parameters: { jsCode: "return $input.all().map(k => ({ ...k.json, invoice_total: k.json.usage * 2.2 }));" } },
        { name: "Email Invoice", type: "n8n-nodes-base.emailSend", parameters: { subject: "Your NeuralRoute Invoice — {{ $now.format('MMMM YYYY') }}" } },
      ],
    }, null, 2),
  },
  {
    id: "churn",
    name: "Churn Prevention",
    trigger: "Stripe customer.subscription.deleted",
    desc: "When a subscription cancels, trigger a win-back sequence: immediate save attempt, 3-day follow-up, and 7-day final offer.",
    steps: [
      "Stripe subscription.deleted webhook",
      "Tag customer in CRM as churned",
      "Send immediate save email (10% off)",
      "Wait 3 days → follow-up if not re-subscribed",
      "Wait 7 days → final offer email",
    ],
    json: JSON.stringify({
      name: "NeuralRoute — Churn Prevention",
      nodes: [
        { name: "Cancel Webhook", type: "n8n-nodes-base.webhook", parameters: { path: "stripe-cancel" } },
        { name: "Revoke Key", type: "n8n-nodes-base.httpRequest", parameters: { url: "https://openrouter.ai/api/v1/auth/key/{{ $json.key_hash }}", method: "DELETE" } },
        { name: "Save Email", type: "n8n-nodes-base.emailSend", parameters: { subject: "We're sorry to see you go — here's 10% off to stay" } },
        { name: "Wait 3 days", type: "n8n-nodes-base.wait", parameters: { amount: 3, unit: "days" } },
        { name: "Follow-up Email", type: "n8n-nodes-base.emailSend", parameters: { subject: "Still thinking it over? We can help." } },
      ],
    }, null, 2),
  },
];

function CopyButton({ text, label = "Copy JSON" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export default function N8NBuilds() {
  const [expanded, setExpanded] = useState<string | null>("onboarding");

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>n8n Automation Builds</h1>
          <p className="text-white/40">4 ready-to-import workflows. Copy the JSON → open n8n → New Workflow → Import → Paste.</p>
        </div>

        {/* Env vars */}
        <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Required Environment Variables</div>
            <CopyButton
              label="Copy .env.local"
              text={ENV_VARS.map((v) => `${v.key}=your_value_here`).join("\n")}
            />
          </div>
          <div className="space-y-2">
            {ENV_VARS.map((v) => (
              <div key={v.key} className="flex items-start gap-4 py-3 border-b border-white/3 last:border-0">
                <code className="text-xs text-[#00e5c3] mono bg-[#00e5c3]/5 px-2 py-1 rounded shrink-0">{v.key}</code>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/60">{v.desc}</div>
                  <a
                    href={`https://${v.where}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/20 hover:text-white/40 mono flex items-center gap-1 mt-0.5"
                  >
                    {v.where} <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflows */}
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div key={wf.id} className="rounded-2xl bg-[#0d1117] border border-white/5 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === wf.id ? null : wf.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/2 transition-all"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#00e5c3]/10 border border-[#00e5c3]/20 flex items-center justify-center shrink-0">
                    <Workflow size={16} className="text-[#00e5c3]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{wf.name}</div>
                    <div className="text-xs text-white/30 mt-0.5">Trigger: {wf.trigger}</div>
                  </div>
                </div>
                {expanded === wf.id ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
              </button>

              {expanded === wf.id && (
                <div className="px-6 pb-6 border-t border-white/5 pt-5">
                  <p className="text-sm text-white/50 mb-5">{wf.desc}</p>

                  {/* Steps */}
                  <div className="mb-5">
                    <div className="text-xs text-white/30 mb-3 font-medium uppercase tracking-wider">Workflow Steps</div>
                    <div className="space-y-2">
                      {wf.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full bg-[#00e5c3]/10 border border-[#00e5c3]/20 flex items-center justify-center text-xs text-[#00e5c3] shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-white/60">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* JSON */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-white/30 font-medium uppercase tracking-wider">n8n JSON</div>
                      <CopyButton text={wf.json} />
                    </div>
                    <pre className="p-4 rounded-xl bg-[#161b22] border border-white/5 text-xs text-white/50 mono overflow-x-auto max-h-64">
                      {wf.json}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Import guide */}
        <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-[#0d1117]">
          <div className="font-semibold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>How to Import in n8n</div>
          <ol className="space-y-2 text-sm text-white/50">
            {[
              "Open your n8n instance",
              "Click + New Workflow",
              'Click the ⋯ menu → "Import from JSON..."',
              "Paste the copied JSON",
              "Update credentials: add your Stripe + OpenRouter + email service",
              "Set the 6 environment variables above",
              "Activate the workflow",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#00e5c3] font-bold shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
