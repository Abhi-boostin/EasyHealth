import { useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mediaFile, setMediaFile] = useState(null);

  const send = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() && !mediaFile) return;
    
    const userMsg = { 
      role: "user", 
      text: input.trim() || "", 
      media: mediaFile ? mediaFile.name : null,
      id: Date.now() + "u" 
    };
    
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setMediaFile(null);
    setSending(true);
    setError("");
    
    try {
      const { data } = await api.post("/api/chat/send", { 
        message: userMsg.text || "Media file uploaded",
        mediaFile: mediaFile 
      });
      
      const botMsg = { 
        role: "bot", 
        text: data?.botReply ?? "", 
        id: Date.now() + "b" 
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just store the file info
      // Later we'll implement actual file upload
      setMediaFile(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-2 border-white bg-gray-900 p-4 flex items-center justify-between">
        <h1 className="text-lg font-mono text-white">EASYHEALTH CHAT</h1>
        <Link to="/" className="text-white font-mono hover:text-gray-300 transition-colors">
          ← BACK
        </Link>
      </header>

      {/* Scrollable Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-black pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/50 mt-10 font-mono">START YOUR CONVERSATION...</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`max-w-2xl ${m.role === "user" ? "ml-auto" : ""}`}>
              <div className={`inline-block border-2 border-white px-4 py-3 ${
                m.role === "user" ? "bg-white text-black" : "bg-gray-900 text-white"
              }`}>
                {m.media && (
                  <div className="mb-2 text-sm font-mono">
                    📎 {m.media}
                  </div>
                )}
                {m.text && (
                  <p className="whitespace-pre-wrap leading-relaxed font-mono">{m.text}</p>
                )}
              </div>
            </div>
          ))
        )}
        {error ? (
          <div className="text-red-400 text-sm font-mono border border-red-400 p-2 max-w-2xl">
            {error}
          </div>
        ) : null}
      </main>

      {/* Sticky Chat Input Form */}
      <form onSubmit={send} className="sticky bottom-0 z-50 p-4 border-2 border-white bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Media Upload */}
          <div className="flex items-center gap-2">
            <label className="bg-white text-black px-3 py-2 font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200 cursor-pointer">
              📎 ADD MEDIA
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </label>
            {mediaFile && (
              <span className="text-white font-mono text-sm">
                {mediaFile.name}
              </span>
            )}
          </div>
          
          {/* Message Input */}
          <div className="flex gap-2">
            <input
              className="flex-1 bg-black text-white border-2 border-white px-3 py-2 font-mono focus:outline-none focus:border-gray-400"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="px-6 py-2 bg-white text-black font-mono border-2 border-white hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50"
              disabled={sending || (!input.trim() && !mediaFile)}
            >
              {sending ? "SENDING..." : "SEND"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 