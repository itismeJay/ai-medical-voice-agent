import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/openaiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: JSON.stringify(AIDoctorAgents),
        },
        {
          role: "user",
          content:
            "User Notes/Symptoms: " +
            notes +
            ", Depends on the user Notes and Symptoms, Please suggest a list of Doctors, Return Object in JSON only",
        },
      ],
    });
    const rawResp = completion.choices[0].message.content || '';
    const response = rawResp.trim().replace('```json', '').replace('```', '');
    const JSONResponse = JSON.parse(response);
    return NextResponse.json(JSONResponse);
  } catch (e) {
    return NextResponse.json(e);
  }
}
