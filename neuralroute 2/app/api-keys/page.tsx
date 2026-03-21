"use client";
import { useState } from "react";
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Check, AlertTriangle } from "lucide-react";

type APIKey = {
  id: string;
  name: string;
  key: string;
  creditLimit: number;
  used: number;
  model: string;
  created: string;
  active: boolean;
};

const INITIAL_KEYS: APIKey[] = [
  { id: "1", name: "Acme Corp", key: "sk-or-v1-acme...8f2a", creditLimit: 45, used: 32.4, model: "all", created: "2025-01-10", active: true },
  { id: "2", name: "Lumitech", key: "sk-or-v1-lumi...3c9d", creditLimit: 175, used: 98.2, model: "all", created: "2025-01-08", active: true },
  { id: "3", name: "Void Labs", key: "sk-or-v1-void...1a4e", creditLimit: 15, used: 14.9, model: "openai/*", created: "2025-01-15", active: true },
];

const MODELS_FILTER = ["all", "openai/*", "anthropic/*", "google/*", "meta-llama/*", "mistralai/*"];

export default function APIKeys() {
  const [keys, setKeys] = useState<APIKey[]>(INITIAL_KEYS);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", creditLimit: "45", model: "all" });
  const [success, setSuccess] = useState<string | null>(null);

  const toggleShow = (id: string) => setShowKeys((p) => ({ ...p, [id]: !p[id] }));

  const copyKey = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const createKey = async () => {
    if (!form.name.trim()) return;
    setCreating(true);

    // Simulate OpenRouter sub-key provisioning
    await new Promise((r) => setTimeout(r, 1500));

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: form.name,
      key: `sk-or-v1-${Math.random().toString(36).slice(2, 8)}...${Math.random().toString(36).slice(2, 6)}`,
      creditLimit: parseFloat(form.creditLimit),
      used: 0,
      model: form.model,
      created: new Date().toISOString().split("T")[0],
      active: true,
    };

    setKeys((prev) => [newKey, ...prev]);
    setCreating(false);
    setSuccess(newKey.id);
    setForm({ name: "", creditLimit: "45", model: "all" });
    setTimeout(() => setSuccess(null), 4000);
  };

  const deleteKey = (id: string) => setKeys((prev) => prev.filter((k) => k.id !== id));
  const toggleActive = (id: string) => setKeys((prev) => prev.map((k) => k.id === id ? { ...k, active: !k.active } : k));

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>API Key Manager</h1>
          <p className="text-white/40">Provision OpenRouter sub-keys for your customers. Each key has its own credit limit and model scope.</p>
        </div>

        {/* Create key form */}
        <div className="p-6 rounded-2xl bg-[#0d1117] border border-[#00e5c3]/20 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Plus size={16} className="text-[#00e5c3]" />
            <span className="font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Create New Sub-Key</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-white/40 mb-2">Customer Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#00e5c3]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Credit Limit (USD)</label>
              <input
                type="number"
                value={form.creditLimit}
                onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
                placeholder="45"
                className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#00e5c3]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Model Scope</label>
              <select
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 focus:outline-none focus:border-[#00e5c3]/30 transition-all"
              >
                {MODELS_FILTER.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-white/30">
              This will call OpenRouter's Management API to provision a real sub-key.
            </p>
            <button
              onClick={createKey}
              disabled={!form.name.trim() || creating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00e5c3] text-[#080c10] font-bold text-sm hover:bg-[#00e5c3]/90 disabled:opacity-40 transition-all"
            >
              {creating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                  Provisioning...
                </span>
              ) : (
                <>
                  <Plus size={15} />
                  Create Key
                </>
              )}
            </button>
          </div>

          {success && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <Check size={15} />
              Sub-key provisioned successfully! Customer can now make API requests.
            </div>
          )}
        </div>

        {/* OpenRouter API note */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-8">
          <AlertTriangle size={15} className="text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-400/80">
            <span className="font-semibold">Real provisioning requires:</span> Set <code className="bg-yellow-500/10 px-1 rounded mono">OPENROUTER_MANAGEMENT_KEY</code> in your <code className="bg-yellow-500/10 px-1 rounded mono">.env.local</code>. The form above simulates the call. To make it real, wire it to <code className="bg-yellow-500/10 px-1 rounded mono">/api/keys/create</code> which calls <code className="bg-yellow-500/10 px-1 rounded mono">openrouter.ai/api/v1/auth/key</code>.
          </div>
        </div>

        {/* Keys list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>Active Keys ({keys.length})</h2>
          </div>

          {keys.map((k) => {
            const usagePct = (k.used / k.creditLimit) * 100;
            const isNearLimit = usagePct > 85;

            return (
              <div
                key={k.id}
                className={`p-5 rounded-2xl border transition-all ${
                  k.active
                    ? "bg-[#0d1117] border-white/5"
                    : "bg-[#0d1117]/40 border-white/3 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.active ? "bg-[#00e5c3]/10" : "bg-white/5"}`}>
                      <Key size={14} className={k.active ? "text-[#00e5c3]" : "text-white/30"} />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white/90">{k.name}</div>
                      <div className="text-xs text-white/30 mono">{k.created}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(k.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                        k.active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {k.active ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => deleteKey(k.id)}
                      className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  {/* Key value */}
                  <div className="sm:col-span-1">
                    <div className="text-xs text-white/30 mb-1.5">API Key</div>
                    <div className="flex items-center gap-2 bg-[#161b22] rounded-lg px-3 py-2 border border-white/5">
                      <code className="text-xs text-white/60 flex-1 mono truncate">
                        {showKeys[k.id] ? k.key : "sk-or-v1-••••••••••••••••"}
                      </code>
                      <button onClick={() => toggleShow(k.id)} className="text-white/30 hover:text-white/60 transition-all shrink-0">
                        {showKeys[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button onClick={() => copyKey(k.key, k.id)} className="text-white/30 hover:text-white/60 transition-all shrink-0">
                        {copied === k.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Usage */}
                  <div>
                    <div className="text-xs text-white/30 mb-1.5">Credits Used</div>
                    <div className="text-sm mb-1.5">
                      <span className={isNearLimit ? "text-yellow-400" : "text-white/80"}>${k.used}</span>
                      <span className="text-white/30"> / ${k.creditLimit}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(usagePct, 100)}%`,
                          background: isNearLimit ? "#f59e0b" : "#00e5c3",
                        }}
                      />
                    </div>
                  </div>

                  {/* Model scope */}
                  <div>
                    <div className="text-xs text-white/30 mb-1.5">Model Scope</div>
                    <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/50 mono">{k.model}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
