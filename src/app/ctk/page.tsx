"use client";

import { type CSSProperties, useEffect, useState } from "react";

const PRACTICE_KEY = "key1:sai_syo_no_1pp_o";
const STORAGE_KEYS = "ctk:keys";
const STORAGE_RESULT = "ctk:result";

export default function CtkPage() {
  const [keys, setKeys] = useState<string[]>(["", "", "", "", ""]);
  const [result, setResult] = useState<{ correct: boolean[]; cleared: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem(STORAGE_KEYS);
      if (savedKeys) {
        const parsed = JSON.parse(savedKeys);
        if (Array.isArray(parsed) && parsed.length === 5) {
          setKeys(parsed.map((v) => (typeof v === "string" ? v : "")));
        }
      }
      const savedResult = localStorage.getItem(STORAGE_RESULT);
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        if (parsed && Array.isArray(parsed.correct) && parsed.correct.length === 5) {
          setResult({ correct: parsed.correct.map(Boolean), cleared: Boolean(parsed.cleared) });
        }
      }
    } catch {
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS, JSON.stringify(keys));
  }, [keys, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (result) localStorage.setItem(STORAGE_RESULT, JSON.stringify(result));
    else localStorage.removeItem(STORAGE_RESULT);
  }, [result, hydrated]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PRACTICE_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys }),
      });
      const data = await res.json();
      setResult(data);
      if (data?.cleared) setOverlayOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-zinc-900 dark:text-zinc-100">
      <h1 className="mb-2 text-4xl font-bold">Capture The Key</h1>
      <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
        シークレットキーの漏洩パターンを実践で学ぶゲーム。5つのKEYを集めるとクリアです。
      </p>
      <p className="mb-8 text-xs text-red-600">
        ※ 外部のサイトで同じことをすると犯罪行為にあたるので絶対にしないでください。
      </p>

      <section className="mb-8 rounded border border-blue-300 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <h2 className="mb-2 font-bold">KEY1（練習）</h2>
        <p className="mb-2 text-sm">
          まずは形式に慣れる練習から。下のKEYをコピーしてKEY1の入力欄に貼り付けてみてください。
          KEY2 以降も <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-zinc-900">keyN:〜</code>（例: <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-zinc-900">key2:〜</code>、<code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-zinc-900">key3:〜</code>）という形式です。
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 select-all rounded border bg-white p-2 text-sm dark:bg-zinc-900">{PRACTICE_KEY}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded border border-blue-600 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-zinc-900"
          >
            {copied ? "コピー済み" : "コピー"}
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">KEY入力</h2>
        <div className="space-y-2">
          {keys.map((value, i) => {
            const state = result ? (result.correct[i] ? "correct" : "wrong") : "idle";
            const inputClass =
              state === "correct"
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : state === "wrong"
                  ? "border-red-500 bg-red-50 dark:bg-red-950"
                  : "border-zinc-300 dark:border-zinc-700";
            const mark = state === "correct" ? "✓" : state === "wrong" ? "✗" : "";
            const markColor = state === "correct" ? "text-green-600" : "text-red-600";
            return (
              <div key={i} className="flex items-center gap-3">
                <label className="w-16 text-sm font-medium">KEY{i + 1}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const next = [...keys];
                    next[i] = e.target.value;
                    setKeys(next);
                  }}
                  placeholder={`key${i + 1}:...`}
                  className={`flex-1 rounded border px-3 py-2 text-sm font-mono dark:bg-zinc-900 ${inputClass}`}
                />
                <span className={`w-5 text-sm ${markColor}`}>{mark}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "検証中..." : "KEYを検証する"}
        </button>
      </section>

      <section className="mb-8 rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-2 font-bold">KEY2〜KEY5のヒント</h2>
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          下のリンクのリポジトリに残された痕跡を探してください。
        </p>
        <a
          href="https://github.com/kabetani-yusei/capture-the-key"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <svg
            viewBox="0 0 16 16"
            width="18"
            height="18"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          <span>GitHub リポジトリを開く</span>
        </a>
      </section>

      {result?.cleared && overlayOpen && (
        <ClearedOverlay onClose={() => setOverlayOpen(false)} />
      )}
    </main>
  );
}

const CONFETTI_COLORS = [
  "#ffd700",
  "#ff6b6b",
  "#48dbfb",
  "#ff9ff3",
  "#1dd1a1",
  "#f368e0",
  "#ff9f43",
  "#54a0ff",
  "#00d2d3",
  "#feca57",
];

type ConfettiPiece = {
  left: number;
  delay: number;
  duration: number;
  color: string;
  width: number;
  height: number;
  drift: number;
  spin: number;
  opacity: number;
  shape: "rect" | "circle";
};

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, () => {
    const shape = Math.random() > 0.3 ? "rect" : "circle";
    const size = 5 + Math.random() * 9;
    return {
      left: Math.random() * 100,
      delay: Math.random() * 0.9,
      duration: 2.7 + Math.random() * 2.8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      width: shape === "rect" ? size * 0.65 : size,
      height: shape === "rect" ? size * 1.7 : size,
      drift: -70 + Math.random() * 140,
      spin: 600 + Math.random() * 420,
      opacity: 0.7 + Math.random() * 0.3,
      shape,
    };
  });
}

function ClearedOverlay({ onClose }: { onClose: () => void }) {
  const [confetti] = useState<ConfettiPiece[]>(() => generateConfetti(90));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 dark:from-yellow-900 dark:via-orange-900 dark:to-pink-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((piece, i) => (
          <span
            key={i}
            className="absolute block will-change-transform"
            style={{
              top: "-30px",
              left: `${piece.left}%`,
              animation: `ctk-confetti-fall ${piece.duration}s ease-in ${piece.delay}s infinite`,
              "--drift": `${piece.drift}px`,
              "--spin": `${piece.spin}deg`,
            } as CSSProperties}
          >
            <span
              className="block shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
              style={{
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                opacity: piece.opacity,
                backgroundColor: piece.color,
                borderRadius: piece.shape === "circle" ? "999px" : "2px",
              }}
            />
          </span>
        ))}
      </div>
      <div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{ animation: "ctk-pop 0.6s ease-out both" }}
      >
        <div className="mb-4 text-6xl font-black text-red-600 drop-shadow-[0_4px_0_rgba(0,0,0,0.15)] sm:text-9xl">
          CLEAR!
        </div>
        <p className="mb-8 max-w-md text-base leading-relaxed text-zinc-800 sm:text-xl dark:text-zinc-100">
          5つのKEYを全部見つけました！
          <br />
          おめでとうございます！
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border-2 border-zinc-900 bg-white px-6 py-2 text-sm font-bold text-zinc-900 shadow-md hover:bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
