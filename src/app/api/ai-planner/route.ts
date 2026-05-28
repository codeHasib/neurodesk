import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { promptText, focusArea, priority } = await req.json();

    if (!promptText) {
      return NextResponse.json(
        { error: "Context is required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // System prompt updated to handle all real-world tasks, routines, and workflows
    const systemInstruction = `
      You are an expert personal operations strategist and task execution engineer built into a high-utility lifestyle and work management dashboard.
      Your sole job is to break down ANY given task, objective, habit, or routine into a clean, actionable execution plan.
      
      The user will provide a task: "${promptText}"
      Category context: "${focusArea}"
      Urgency tracking: "${priority}"

      Provide exactly 4 logical, sequential, clear steps to accomplish this task.
      - Works for daily life routines (e.g., getting ready, meal prep, wind-down habits).
      - Works for business, logistics, design, and developer operations.
      - Keep each step short, clear, actionable, and a single sentence.
      - Do not use markdown characters, bullet symbols, numbers, or bolding in the text.
      - Separate each step with a clean new line character.
    `;

    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    const text = response.text().trim();

    const steps = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 4);

    return NextResponse.json({ steps });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Strategy generation failed", details: error.message },
      { status: 500 },
    );
  }
}
