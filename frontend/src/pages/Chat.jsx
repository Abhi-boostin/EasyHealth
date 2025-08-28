import { useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const send = async (e) => {
    e?.preventDefault?.();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim(), id: Date.now() + "u" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    setError("");
    try {
      const { data } = await api.post("/api/chat/send", { message: userMsg.text });
      const botMsg = { role: "bot", text: data?.botReply ?? "", id: Date.now() + "b" };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col">
      <header className="border-b border-white/10 p-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">EasyHealth Chat</h1>
        <Link to="/" className="text-sm text-indigo-300 hover:underline">Back</Link>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-white/50 mt-10">Start your conversation…</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`max-w-2xl ${m.role === "user" ? "ml-auto" : ""}`}>
              <div className={`inline-block rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-indigo-600" : "bg-white/10"}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))
        )}
        {error ? <div className="text-red-400 text-sm">{error}</div> : null}
      </main>

      <form onSubmit={send} className="p-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 rounded-xl bg-transparent border border-white/15 px-4 py-3 outline-none focus:border-indigo-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60"
            disabled={sending || !input.trim()}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
} 