import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    summary: "このKEYは現在使用が止められています。",
  });
}
