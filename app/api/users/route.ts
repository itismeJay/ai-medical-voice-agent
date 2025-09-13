import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  try {
    //check if user exists in the database
    const users = await db.select().from(usersTable).where(
      //@ts-ignore
      eq(usersTable.email, user?.primaryEmailAddress?.emailAddress)
    );

    if (!user?.fullName || !user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User info incomplete." },
        { status: 400 }
      );
    }

    //if no user found, insert user into database
    if (users.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          credits: 5,
        })
        .returning();

      return NextResponse.json(result[0]);
    }

    //if user exists, return user data
    return NextResponse.json(users[0]);
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
