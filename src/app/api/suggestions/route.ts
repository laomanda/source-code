import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { suggestionSchema } from "@/lib/validations/suggestion";
import { SuggestionType } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = suggestionSchema.safeParse({
      type: body.type,
      description: typeof body.description === "string" ? body.description.trim() : "",
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid suggestion input.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const validData = validation.data;
    const supabase = await createClient();

    const { error } = await supabase.from("developer_suggestions").insert({
      type: validData.type as SuggestionType,
      description: validData.description,
    });

    if (error) {
      console.error("Supabase API insert error on developer_suggestions:", error.message);
      return NextResponse.json({ error: error.message || "Failed to save suggestion." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Unexpected error in /api/suggestions POST:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
