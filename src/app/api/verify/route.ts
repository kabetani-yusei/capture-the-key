import { NextResponse } from "next/server";

const ANSWER_HASHES = [
  "d7554a6959c21c07165c7676f4f940fea3916a6ed90dff776d8d1a4bff9ce569",
  "177bd0d32be308cafb9a273662f6e94414a20e43ef96570ce2f77f27ddd99f1c",
  "ef650ea886273b2230b009991e73f51c9a3fb62926588fa1d4db2900b753aae8",
  "48e47982fa73788824a9de5cf03c16921efce82b11908e366d4a1c92343c25a7",
  "f7d3a89a6fb9fc6cc497dc43aafec1810cb9aa75d478fa6e8fb761b271aa09eb",
];

const encoder = new TextEncoder();

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { keys?: unknown } | null;
  const keys = body?.keys;
  if (!Array.isArray(keys) || keys.length !== 5) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const correct = await Promise.all(
    ANSWER_HASHES.map(async (answerHash, i) => {
      const submitted = keys[i];
      if (typeof submitted !== "string") {
        return false;
      }
      return (await sha256Hex(submitted)) === answerHash;
    }),
  );

  const cleared = correct.every(Boolean);
  return NextResponse.json({ correct, cleared });
}
