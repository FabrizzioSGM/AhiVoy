"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Send, Trash2, Sparkles, Wrench, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  sent_at: string | null;
}

const categories = [
  { value: "feature", label: "Nueva función", icon: Sparkles, color: "text-sky-600 bg-sky-50" },
  { value: "fix", label: "Corrección", icon: Wrench, color: "text-green-600 bg-green-50" },
  { value: "improvement", label: "Mejora", icon: Zap, color: "text-violet-600 bg-violet-50" },
];

export function DigestManager() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("feature");
  const [adding, setAdding] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/admin/changelog");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setAdding(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/changelog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), category }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setTitle("");
      setDescription("");
      setCategory("feature");
      setMessage({ type: "success", text: "Entrada agregada" });
      fetchEntries();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error al agregar" });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/changelog?id=${id}`, { method: "DELETE" });
      fetchEntries();
    } catch {
      // ignore
    }
  };

  const handleSendDigest = async () => {
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/send-digest", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: `Digest enviado a ${data.sent_to} usuarios (${data.entries_sent} entradas)` });
      fetchEntries();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error al enviar" });
    } finally {
      setSending(false);
    }
  };

  const pendingEntries = entries.filter((e) => !e.sent_at);
  const sentEntries = entries.filter((e) => e.sent_at);

  return (
    <div className="space-y-6">
      {/* Add Entry Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Agregar novedad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label htmlFor="title" className="mb-1.5 block text-xs">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej: Chat en tiempo real entre partes"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="desc" className="mb-1.5 block text-xs">Descripción</Label>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción breve de la novedad..."
                className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Categoría</Label>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                      category === cat.value
                        ? `${cat.color} border-current`
                        : "text-ink-400 bg-white border-surface-200 hover:border-surface-300"
                    )}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" size="sm" disabled={adding || !title.trim() || !description.trim()}>
              {adding ? "Agregando..." : "Agregar entrada"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending entries */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">
            Pendientes de envío ({pendingEntries.length})
          </CardTitle>
          {pendingEntries.length > 0 && (
            <Button
              size="sm"
              onClick={handleSendDigest}
              disabled={sending}
              className="gap-2 bg-sky-600 hover:bg-sky-700"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? "Enviando..." : "Enviar digest ahora"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-ink-400">Cargando...</p>
          ) : pendingEntries.length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-4">No hay entradas pendientes. Agrega novedades arriba.</p>
          ) : (
            <div className="space-y-3">
              {pendingEntries.map((entry) => {
                const cat = categories.find((c) => c.value === entry.category);
                return (
                  <div key={entry.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-surface-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {cat && <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", cat.color)}>{cat.label}</span>}
                        <span className="text-xs text-ink-300">{new Date(entry.created_at).toLocaleDateString("es-MX")}</span>
                      </div>
                      <p className="text-sm font-medium text-ink-800 truncate">{entry.title}</p>
                      <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{entry.description}</p>
                    </div>
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-ink-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sent entries */}
      {sentEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-ink-500">Enviados anteriormente ({sentEntries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sentEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface-50 text-sm">
                  <span className="text-ink-400 text-xs">{new Date(entry.sent_at!).toLocaleDateString("es-MX")}</span>
                  <span className="text-ink-600 truncate">{entry.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      {message && (
        <div className={cn(
          "text-sm px-4 py-3 rounded-lg border",
          message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        )}>
          {message.text}
        </div>
      )}
    </div>
  );
}
