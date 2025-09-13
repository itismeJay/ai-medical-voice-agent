import { db } from "@/config/db";
import { sessionsTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();
  // Generate a unique session ID
  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(sessionsTable)
      .values({
        sessionId: sessionId,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdOn: new Date().toString(),
      })
      .returning();
    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json(e);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  if (!user || !sessionId) {
    return NextResponse.json(
      { error: "Unauthorized or sessionId missing" },
      { status: 401 }
    );
  }

  if (sessionId === "all") {
    try {
      const result = await db
        .select()
        .from(sessionsTable)
        .where(
          eq(
            sessionsTable.createdBy,
            user?.primaryEmailAddress?.emailAddress || ""
          )
        )
        .orderBy(desc(sessionsTable.id));
      return NextResponse.json(result);
    } catch (e) {
      return NextResponse.json(e);
    }
  } else {
    try {
      const result = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionId, sessionId));

      return NextResponse.json(result[0]);
    } catch (e) {
      return NextResponse.json(e);
    }
  }
}
