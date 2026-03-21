"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ChevronDown, Zap, RotateCcw } from "lucide-react";

const MODELS = [
  { id: "openai/gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI", cost: "cheap" },
  { id: "openai/gpt-4o", label: "GPT-4o", provider: "OpenAI", cost: "mid" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic", cost: "mid" },
  { id: "anthropic/claude-3-haiku", label: "Claude 3 Haiku", provider: "Anthropic", cost: "cheap" },
  { id: "google/gemini-flash-1.5", label: "Gemini Flash 1.5", provider: "Google", cost: "cheap" },
  { id: "meta-llama/llama-3.1-70b-instruct", label: "Llama 3.1 70B", provider: "Meta", cost: "mid" },
  { id: "mistralai/mistral-large", label: "Mistral Large", provider: "Mistral", cost: "mid" },
];

type Message = { role: "user" | "assistant"; content: string };

function estimateTokens(text: string) {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [streaming, setStreaming] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // placeholder for streaming response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, model: model.id }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: `⚠️ Error: ${err.error || "API request failed. Make sure OPENROUTER_API_KEY is set."}` },
        ]);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            fullText += delta;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", content: fullText },
            ]);
          } catch {}
        }
      }
      setTotalTokens((t) => t + estimateTokens(fullText) + estimateTokens(input));
    } catch (e) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "⚠️ Network error. Check your connection." },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([]);
    setTotalTokens(0);
  };

  const selectedModel = model;

  return (
    <div className="pt-16 h-screen flex flex-col bg-[#080c10]">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-[#0d1117] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/3 hover:bg-white/5 text-sm transition-all"
            >
              <Zap size={13} className="text-[#00e5c3]" />
              <span className="text-white/80">{selectedModel.label}</span>
              <span className="text-white/30 text-xs">{selectedModel.provider}</span>
              <ChevronDown size={13} className="text-white/40" />
            </button>

            {modelOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl z-50 overflow-hidden">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setModel(m); setModelOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-all ${
                      m.id === selectedModel.id ? "bg-[#00e5c3]/5 text-[#00e5c3]" : "text-white/70"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-left">{m.label}</div>
                      <div className="text-xs text-white/30">{m.provider}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-md ${
                      m.cost === "cheap" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {m.cost}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Token counter + reset */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-white/30 mono">
            ~{totalTokens.toLocaleString()} tokens used
          </div>
          <button onClick={reset} className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-[#00e5c3]/10 border border-[#00e5c3]/20 flex items-center justify-center mx-auto mb-4">
                <Bot size={28} className="text-[#00e5c3]" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                NeuralRoute Chat
              </h2>
              <p className="text-white/30 text-sm max-w-sm mx-auto">
                Connected to OpenRouter. Select a model above and send a message to start streaming.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {["Explain quantum computing", "Write a Python API", "What is RAG?", "Summarize my business idea"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-4 py-2 rounded-full text-sm border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 message-in ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-[#00e5c3]/10 border border-[#00e5c3]/20"
                  : "bg-white/5 border border-white/10"
              }`}>
                {msg.role === "user"
                  ? <User size={14} className="text-[#00e5c3]" />
                  : <Bot size={14} className="text-white/60" />
                }
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#00e5c3]/10 border border-[#00e5c3]/15 text-white/90 rounded-tr-sm"
                  : "bg-[#0d1117] border border-white/5 text-white/80 rounded-tl-sm"
              } ${streaming && i === messages.length - 1 && msg.role === "assistant" && msg.content === "" ? "streaming-cursor" : ""}`}>
                {msg.content || (streaming && i === messages.length - 1 ? <span className="streaming-cursor" /> : "")}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-[#0d1117] p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message NeuralRoute... (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder:text-white/20 resize-none focus:outline-none focus:border-[#00e5c3]/30 focus:ring-1 focus:ring-[#00e5c3]/20 transition-all min-h-[48px] max-h-[200px]"
              style={{ height: "auto" }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = `${Math.min(t.scrollHeight, 200)}px`;
              }}
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="w-12 h-12 rounded-xl bg-[#00e5c3] flex items-center justify-center text-[#080c10] hover:bg-[#00e5c3]/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-white/20 mt-2 max-w-3xl mx-auto">
          OpenRouter streams tokens directly. Model: <span className="text-white/40 mono">{selectedModel.id}</span>
        </p>
      </div>
    </div>
  );
}
