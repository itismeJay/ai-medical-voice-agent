import { db } from "@/config/db";
import { sessionsTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/openaiModel";
import { AIDoctorAgents } from "@/shared/list";

const REPORTGENERATION_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor AI Agent info and Conversation between AI medical agent and user, generate a structured report with the following fields:

sessionId: a unique session identifier

agent: the medical specialist name (e.g., “General Physician AI”)

user: name of the patient or “Anonymous” if not provided

timestamp: current date and time in ISO format

chiefComplaint: one-sentence summary of the main health concern

summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations

symptoms: list of symptoms mentioned by the user

duration: how long the user has experienced the symptoms

severity: mild, moderate, or severe

medicationsMentioned: list of any medicines mentioned

recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}


Only include valid fields. Respond with nothing else.`;

export async function POST(req: NextRequest) {
  const { messages, sessionDetails, sessionId } = await req.json();
  const user = await currentUser();

  try {
    const userInput =
      "AI Doctor Agent Info:" +
      JSON.stringify(sessionDetails) +
      "conversation: " +
      JSON.stringify(messages);
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: REPORTGENERATION_PROMPT },
        {
          role: "user",
          content: userInput,
        },
      ],
    });
    const rawResp = completion.choices[0].message.content || "";
    const response = rawResp.trim().replace("```json", "").replace("```", "");
    const JSONResponse = JSON.parse(response);

    //save to database
    const result = await db.update(sessionsTable).set({
      report: JSONResponse,
      conversation: messages,
    });

    return NextResponse.json(JSONResponse);
  } catch (e) {
    return NextResponse.json(e);
  }
}
