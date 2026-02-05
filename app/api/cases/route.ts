import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const allCases = await db.select().from(cases).orderBy(desc(cases.createdAt));
    return NextResponse.json(allCases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, seedAddress } = body;

    if (!title || !seedAddress) {
      return NextResponse.json({ error: "Title and seed address are required" }, { status: 400 });
    }

    const caseNumber = `CASE-${Date.now().toString(36).toUpperCase()}`;

    const [newCase] = await db.insert(cases).values({
      caseNumber,
      title,
      description,
      seedAddress,
      status: "open",
    }).returning();

    return NextResponse.json(newCase);
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
