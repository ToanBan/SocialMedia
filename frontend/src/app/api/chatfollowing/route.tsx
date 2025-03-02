import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get('token')?.value || '';
  const res = await fetch("http://localhost:3001/chatfollowing", {
    method: "GET",
    headers: {
      Cookie: `token=${token}`
    },
    credentials: "include"
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
