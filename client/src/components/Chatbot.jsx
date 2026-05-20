import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I can help with bookings, delivery, OTP, payments, and vehicle listings." }
  ]);

  async function send() {
    if (!message.trim() || !user) return;
    const nextMessage = message;
    setMessages((items) => [...items, { role: "user", content: nextMessage }]);
    setMessage("");
    try {
      const { data } = await api.post("/ai/chat", { message: nextMessage });
      setMessages((items) => [...items, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((items) => [...items, { role: "assistant", content: "Please login and try again." }]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="glass flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-3xl shadow-glow">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-2 font-black">
              <Bot className="text-mint" /> AI Support
            </div>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div key={index} className={`rounded-2xl p-3 text-sm ${item.role === "user" ? "ml-8 bg-brand" : "mr-8 bg-white/10"}`}>
                {item.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <input className="input" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask anything..." />
            <button className="btn-primary px-4" onClick={send}>
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-primary flex items-center gap-2" onClick={() => setOpen(true)}>
          <Bot /> AI Help
        </button>
      )}
    </div>
  );
}
