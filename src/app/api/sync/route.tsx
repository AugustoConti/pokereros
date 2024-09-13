import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

// eslint-disable-next-line import/no-unused-modules
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de mesa no proporcionado" }, { status: 400 });
  }

  const tableData = await kv.get(`table:${id}`);

  if (!tableData) {
    return NextResponse.json({ error: "Mesa no encontrada" }, { status: 404 });
  }

  return NextResponse.json(tableData);
}

// eslint-disable-next-line import/no-unused-modules
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de mesa no proporcionado" }, { status: 400 });
  }

  const tableData = await request.json();

  await kv.set(`table:${id}`, tableData);

  return NextResponse.json({ message: "Mesa sincronizada con éxito", id });
}
