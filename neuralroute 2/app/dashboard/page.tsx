"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Zap, Key, MoreHorizontal, ArrowUpRight } from "lucide-react";

const usageData = [
  { day: "Mon", tokens: 420000, cost: 8.4, revenue: 18 },
  { day: "Tue", tokens: 650000, cost: 13, revenue: 28 },
  { day: "Wed", tokens: 380000, cost: 7.6, revenue: 16 },
  { day: "Thu", tokens: 890000, cost: 17.8, revenue: 38 },
  { day: "Fri", tokens: 1200000, cost: 24, revenue: 52 },
  { day: "Sat", tokens: 540000, cost: 10.8, revenue: 23 },
  { day: "Sun", tokens: 720000, cost: 14.4, revenue: 31 },
];

const modelBreakdown = [
  { model: "GPT-4o Mini", pct: 38, color: "#60a5fa" },
  { model: "Claude 3 Haiku", pct: 27, color: "#00e5c3" },
  { model: "Gemini Flash", pct: 18, color: "#a855f7" },
  { model: "GPT-4o", pct: 11, color: "#f59e0b" },
  { model: "Other", pct: 6, color: "#374151" },
];

const customers = [
  { name: "Acme Corp", email: "dev@acme.io", plan: "Pro", used: 32.4, limit: 45, status: "active", keys: 7 },
  { name: "Lumitech", email: "api@lumitech.ai", plan: "Enterprise", used: 98.2, limit: 175, status: "active", keys: 23 },
  { name: "Void Labs", email: "ops@voidlabs.dev", plan: "Starter", used: 14.9, limit: 15, status: "near-limit", keys: 1 },
  { name: "NovaSpark", email: "hello@novaspark.io", plan: "Pro", used: 8.1, limit: 45, status: "active", keys: 3 },
  { name: "DeepStack", email: "ai@deepstack.com", plan: "Enterprise", used: 142.0, limit: 175, status: "active", keys: 41 },
];

const kpis = [
  { label: "Monthly Revenue", value: "$4,820", change: +18.4, icon: DollarSign, color: "#00e5c3" },
  { label: "Active Customers", value: "47", change: +6, icon: Users, color: "#60a5fa" },
  { label: "Total Tokens (7d)", value: "4.8M", change: +22.1, icon: Zap, color: "#a855f7" },
  { label: "Active API Keys", value: "183", change: +11, icon: Key, color: "#f59e0b" },
];

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  "near-limit": "bg-yellow-500/10 text-yellow-400",
  paused: "bg-red-500/10 text-red-400",
};

export default function Dashboard() {
  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Last 7 days · Refreshes every 60s</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            Live
          </div>
        </div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k) => (
            <div key={k.label} className="p-5 rounded-2xl bg-[#0d1117] border border-white/5">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}
                >
                  <k.icon size={16} style={{ color: k.color }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${k.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {k.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(k.change)}%
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{k.value}</div>
              <div className="text-xs text-white/30 mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          {/* Revenue chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0d1117] border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Revenue vs Cost</div>
                <div className="text-xs text-white/30">Daily · this week</div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#00e5c3]" />Revenue</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white/20" />Cost</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={usageData} barGap={4}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#ffffff40" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#ffffff40" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#ffffff80" }}
                />
                <Bar dataKey="revenue" fill="#00e5c3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Model breakdown */}
          <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/5">
            <div className="font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Model Mix</div>
            <div className="text-xs text-white/30 mb-6">% of token requests</div>
            <div className="space-y-4">
              {modelBreakdown.map((m) => (
                <div key={m.model}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/60">{m.model}</span>
                    <span style={{ color: m.color }} className="font-medium">{m.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${m.pct}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Token chart */}
        <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/5 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Token Volume</div>
              <div className="text-xs text-white/30">Millions of tokens per day</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5c3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00e5c3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#ffffff40" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${(v / 1000000).toFixed(2)}M tokens`, "Volume"]}
              />
              <Area type="monotone" dataKey="tokens" stroke="#00e5c3" strokeWidth={2} fill="url(#tokenGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customer table */}
        <div className="rounded-2xl bg-[#0d1117] border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <div className="font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Customers</div>
              <div className="text-xs text-white/30">Top by usage</div>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-[#00e5c3] hover:underline">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Customer", "Plan", "Credits Used", "Keys", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email} className="border-b border-white/3 hover:bg-white/2 transition-all">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-white/90">{c.name}</div>
                      <div className="text-xs text-white/30 mono">{c.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/50">{c.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white/80">${c.used} / ${c.limit}</div>
                      <div className="mt-1.5 h-1 rounded-full bg-white/5 w-24">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(c.used / c.limit) * 100}%`,
                            background: c.used / c.limit > 0.9 ? "#f59e0b" : "#00e5c3",
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">{c.keys}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-md ${statusStyles[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-white/20 hover:text-white/60 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
