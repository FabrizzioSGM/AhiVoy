"use client";
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

async function fetchMessages(matchId: string): Promise<Message[]> {
  const res = await fetch(`/api/messages/${matchId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.messages ?? [];
}

async function sendMessage(matchId: string, message: string): Promise<boolean> {
  const res = await fetch(`/api/messages/${matchId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.ok;
}

export function MatchChat({ matchId, currentUserId }: { matchId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages(matchId).then((msgs) => {
      if (msgs === null) {
        setUnavailable(true);
      } else {
        setMessages(msgs);
      }
    });
    const interval = setInterval(() => {
      fetchMessages(matchId).then((msgs) => {
        if (msgs) setMessages(msgs);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const success = await sendMessage(matchId, input.trim());
    if (success) {
      setInput("");
      const msgs = await fetchMessages(matchId);
      if (msgs) setMessages(msgs);
    }
    setSending(false);
  };

  if (unavailable) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-8 h-8 text-ink-200 mx-auto mb-2" />
          <p className="text-sm text-ink-400">Mensajería no disponible aún</p>
          <p className="text-xs text-ink-300 mt-1">Esta función estará habilitada próximamente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />Mensajes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
          {messages.length === 0 ? (
            <p className="text-xs text-ink-400 text-center py-4">Sin mensajes. Inicia la conversación.</p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${isMine ? "bg-accent-500 text-white" : "bg-surface-100 text-ink-800"}`}>
                    <p>{msg.message}</p>
                    <p className={`text-[10px] mt-0.5 ${isMine ? "text-accent-200" : "text-ink-300"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || sending}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
