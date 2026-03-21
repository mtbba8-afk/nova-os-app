import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, BarChart3, Key, Workflow, ChevronRight } from "lucide-react";

const stats = [
  { value: "200+", label: "AI Models" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<50ms", label: "Avg Latency" },
  { value: "∞", label: "Scale" },
];

const features = [
  {
    icon: Zap,
    title: "OpenRouter Integration",
    desc: "Access 200+ AI models through a single unified API. GPT-4, Claude, Gemini, Llama — all in one place.",
    tag: "Core",
  },
  {
    icon: Key,
    title: "Sub-Key Management",
    desc: "Provision customer API keys automatically with credit limits, rate limits, and instant revocation.",
    tag: "Billing",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    desc: "Real-time dashboards showing token usage, cost breakdown, and per-customer analytics.",
    tag: "Insights",
  },
  {
    icon: Workflow,
    title: "n8n Automation",
    desc: "4 pre-built workflows: customer onboarding, usage alerts, invoice generation, and churn prevention.",
    tag: "Automation",
  },
  {
    icon: Shield,
    title: "Spend Controls",
    desc: "Hard credit limits per key, auto-pause on overage, and email alerts before customers hit their cap.",
    tag: "Safety",
  },
  {
    icon: Globe,
    title: "White-Label Ready",
    desc: "Your domain, your branding, your pricing. Customers never see OpenRouter — they see you.",
    tag: "Branding",
  },
];

const models = ["GPT-4o", "Claude 3.5", "Gemini Pro", "Llama 3.1", "Mistral", "Qwen 2.5"];

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-[#00e5c3]/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00e5c3]/20 bg-[#00e5c3]/5 text-[#00e5c3] text-sm font-medium mb-8 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c3] pulse-dot" />
            OpenRouter-Powered AI Reseller Platform
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight mb-6 fade-up-delay-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Resell AI
            <br />
            <span className="animated-gradient">at your price.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed fade-up-delay-2">
            Build an AI API business in hours. Access 200+ models through OpenRouter, provision customer keys automatically, and keep the margin.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up-delay-3">
            <Link
              href="/chat"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00e5c3] text-[#080c10] font-bold text-base hover:bg-[#00e5c3]/90 transition-all glow-border"
            >
              Start for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all text-base"
            >
              View Pricing
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Model pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-12 fade-up-delay-3">
            <span className="text-xs text-white/30 mr-1">Includes:</span>
            {models.map((m) => (
              <span key={m} className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/50 font mono">
                {m}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/40">+195 more</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-[#0d1117]">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-[#00e5c3] mb-1 glow-text" style={{ fontFamily: 'Syne, sans-serif' }}>
                {s.value}
              </div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Everything you need to
            <br />
            <span className="text-[#00e5c3]">run an AI business</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            From API proxy to billing to automation — the full stack, pre-built.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-[#0d1117] border border-white/5 glow-border-hover transition-all cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00e5c3]/10 border border-[#00e5c3]/20 flex items-center justify-center">
                  <f.icon size={18} className="text-[#00e5c3]" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-white/30 mono">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-[#00e5c3]/20 bg-[#00e5c3]/5 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-[#00e5c3]/10 blur-[80px]" />
            </div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                From $0 to running
                <br />
                <span className="text-[#00e5c3]">in under an hour.</span>
              </h2>
              <p className="text-white/50 mb-8 text-lg">
                Deploy to Vercel. Connect OpenRouter. Import n8n workflows. Done.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00e5c3] text-[#080c10] font-bold hover:bg-[#00e5c3]/90 transition-all"
              >
                Get Started — $29/mo <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-white/20 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={14} className="text-[#00e5c3]" />
          <span style={{ fontFamily: 'Syne, sans-serif' }}>NeuralRoute</span>
        </div>
        <p>Powered by OpenRouter · Built on Next.js · Deploy on Vercel</p>
      </footer>
    </div>
  );
}
