"use client";

import { useEffect, useState } from "react";

type AdminContactItem = {
  id?: string;
  createdAt?: string;
  name?: string;
  email?: string;
  message?: string;
};

type AdminContactsResponse =
  | { ok: true; items: AdminContactItem[] }
  | { ok: false; error: string; requestId?: string };

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function AdminPage() {
  const [gate, setGate] = useState<string>("");
  const [items, setItems] = useState<AdminContactItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const saved = sessionStorage.getItem("devflow_admin_gate");
    if (saved) setGate(saved);
  }, []);

  async function load() {
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(`/api/admin/contacts?limit=50`, {
        headers: {
          Accept: "application/json",
          "x-admin-gate": gate,
        },
        cache: "no-store",
      });

      const data = (await res
        .json()
        .catch(() => ({}))) as AdminContactsResponse;

      if (!res.ok || (data as any)?.ok === false) {
        const msg =
          (data as any)?.error ??
          `Request failed (${res.status} ${res.statusText})`;

        const reqId =
          (data as any)?.requestId ?? res.headers.get("x-request-id");

        throw new Error(reqId ? `${msg} (requestId: ${reqId})` : msg);
      }

      setItems((data as { ok: true; items: AdminContactItem[] }).items ?? []);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  function unlock() {
    sessionStorage.setItem("devflow_admin_gate", gate);
    void load();
  }

  const isLocked = !gate;

  return (
    <main className="p-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-gray-600">Dev-only admin panel</p>
      </header>

      <section className="rounded-md border p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium">Admin gate</label>
          <input
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            placeholder="Enter gate"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button
            onClick={unlock}
            className="rounded-md border px-4 py-2 font-medium disabled:opacity-50"
            disabled={!gate || status === "loading"}
          >
            {status === "loading" ? "Loading…" : "Unlock"}
          </button>

          <button
            onClick={load}
            className="rounded-md border px-4 py-2 font-medium disabled:opacity-50"
            disabled={isLocked || status === "loading"}
          >
            Refresh
          </button>
        </div>

        <p className="text-xs text-gray-600">
          Stored in sessionStorage as <code>devflow_admin_gate</code>.
        </p>
      </section>

      {status === "error" && (
        <div className="rounded-md border p-4">
          <p className="text-sm">❌ {error}</p>
        </div>
      )}

      <section className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-md border p-4">
            <p className="text-sm">
              {isLocked
                ? "Locked. Enter gate to load items."
                : "No submissions yet."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id ?? item.createdAt ?? Math.random()}
                className="rounded-md border p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">
                    {item.name ?? "Unknown"}{" "}
                    <span className="text-gray-600 font-normal">
                      ({item.email ?? "no email"})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                {item.message && (
                  <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
