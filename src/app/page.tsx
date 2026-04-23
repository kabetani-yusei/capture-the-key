"use client";

import Link from "next/link";
import { useState } from "react";

const KEY2 = "key2:git_hub_ni_push_sh1_nai";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch(`/api/summarize?key=${process.env.NEXT_PUBLIC_KEY3}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-zinc-900 dark:text-zinc-100">
      <h1 className="mb-2 text-3xl font-bold">要約アプリ</h1>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        文章を入力して「要約する」ボタンを押してください。
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-3 h-40 w-full rounded border border-zinc-300 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        placeholder="要約したい文章をここに入力"
      />
      <button
        onClick={handleSummarize}
        disabled={loading || !text}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "要約中..." : "要約する"}
      </button>
      {summary && (
        <div className="mt-5 rounded border border-zinc-300 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          {summary}
        </div>
      )}

      <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Link
          href="/ctk"
          className="inline-block rounded border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          Capture The Key →
        </Link>
      </div>
    </main>
  );
}
