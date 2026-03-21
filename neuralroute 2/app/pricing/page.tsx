import { Check, Zap, Shield, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: 29,
    cost: 12,
    margin: 58,
    icon: Zap,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    accent: "#60a5fa",
    credits: "$15",
    models: "50+",
    features: [
      "50+ AI models",
      "$15 monthly credits",
      "1 API key",
      "Basic analytics",
      "Email support",
      "Rate limit: 60 req/min",
    ],
  },
  {
    name: "Pro",
    price: 79,
    cost: 35,
    margin: 56,
    icon: Shield,
    color: "from-[#00e5c3]/20 to-[#00e5c3]/5",
    border: "border-[#00e5c3]/40",
    accent: "#00e5c3",
    credits: "$45",
    models: "150+",
    popular: true,
    features: [
      "150+ AI models",
      "$45 monthly credits",
      "10 API sub-keys",
      "Advanced analytics",
      "Priority support",
      "Rate limit: 300 req/min",
      "Usage webhooks",
      "Custom spend limits",
    ],
  },
  {
    name: "Enterprise",
    price: 299,
    cost: 110,
    margin: 63,
    icon: Crown,
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/20",
    accent: "#a855f7",
    credits: "$175",
    models: "200+",
    features: [
      "All 200+ AI models",
      "$175 monthly credits",
      "Unlimited API sub-keys",
      "Full analytics suite",
      "Dedicated support",
      "Unlimited rate limit",
      "n8n automation pack",
      "SLA guarantee",
      "Custom model routing",
      "White-label branding",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Simple, transparent
            <br />
            <span className="text-[#00e5c3]">pricing</span>
          </h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            You buy wholesale from OpenRouter. You charge retail. Keep the margin.
          </p>
        </div>

        {/* Margin explainer */}
        <div className="flex items-center justify-center gap-4 mb-12 p-4 rounded-xl border border-white/5 bg-white/2 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-xs text-white/30 mb-1">You pay OpenRouter</div>
            <div className="font-bold text-white/60">~$12–110</div>
          </div>
          <div className="text-[#00e5c3] font-bold text-lg">→</div>
          <div className="text-center">
            <div className="text-xs text-white/30 mb-1">Customer pays you</div>
            <div className="font-bold text-white">$29–299</div>
          </div>
          <div className="text-[#00e5c3] font-bold text-lg">→</div>
          <div className="text-center">
            <div className="text-xs text-[#00e5c3]/60 mb-1">Your margin</div>
            <div className="font-bold text-[#00e5c3]">56–63%</div>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-gradient-to-b ${plan.color} ${plan.border} p-8 flex flex-col ${
                plan.popular ? "ring-1 ring-[#00e5c3]/30 scale-[1.02]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00e5c3] text-[#080c10] text-xs font-bold">
                  Most Popular
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${plan.accent}20`, border: `1px solid ${plan.accent}30` }}
                >
                  <plan.icon size={18} style={{ color: plan.accent }} />
                </div>
                <span className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>{plan.name}</span>
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-5xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>${plan.price}</span>
                <span className="text-white/40 ml-1">/month</span>
              </div>

              {/* Cost + margin */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <span className="text-xs text-white/30">Cost: <span className="line-through">${plan.cost}</span></span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={{ background: `${plan.accent}20`, color: plan.accent }}
                >
                  {plan.margin}% margin
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: plan.accent }} />
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/chat"
                className="block text-center py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: plan.popular ? plan.accent : `${plan.accent}15`,
                  color: plan.popular ? "#080c10" : plan.accent,
                  border: `1px solid ${plan.accent}30`,
                }}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ strip */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            {
              q: "How do API keys work?",
              a: "You get a management key from OpenRouter. Your n8n workflow provisions sub-keys for each customer with a credit limit you define.",
            },
            {
              q: "When do I get paid?",
              a: "Stripe collects from your customer. The n8n webhook triggers immediately after checkout.session.completed.",
            },
            {
              q: "What if a customer overspends?",
              a: "OpenRouter enforces hard credit limits on sub-keys. When they hit the cap, requests return 429. You get a webhook alert.",
            },
          ].map((item) => (
            <div key={item.q} className="p-6 rounded-xl border border-white/5 bg-[#0d1117]">
              <div className="font-semibold mb-2 text-white/80" style={{ fontFamily: 'Syne, sans-serif' }}>{item.q}</div>
              <div className="text-sm text-white/40 leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
