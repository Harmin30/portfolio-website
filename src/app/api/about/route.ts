import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

// Parse education/experience strings into structured arrays
const parseEducation = (edu: any): any => {
  if (Array.isArray(edu)) return edu;
  if (!edu) return [];
  if (typeof edu === "string") {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(edu);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    // Parse line-separated format
    const lines = edu.split("\n").filter((line: string) => line.trim());
    const items = [];
    let currentItem: any = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if this looks like a title/degree (contains "in", "of", or "Development")
      if (
        trimmed.includes("in ") ||
        trimmed.includes("of ") ||
        trimmed.includes("Development") ||
        trimmed.includes("Science")
      ) {
        if (currentItem) items.push(currentItem);
        currentItem = { degree: trimmed, school: "", year: "", details: "" };
      } else if (trimmed.match(/\d{4}/)) {
        // Has year
        if (currentItem) {
          const parts = trimmed.split("|");
          currentItem.school = parts[0]?.trim() || "";
          currentItem.year = parts[1]?.trim() || "";
        }
      } else if (currentItem) {
        // Additional details
        currentItem.details =
          (currentItem.details ? currentItem.details + " " : "") + trimmed;
      }
    }

    if (currentItem) items.push(currentItem);
    return items.length > 0
      ? items
      : [{ degree: edu, school: "", year: "", details: "" }];
  }
  return [];
};

const parseExperience = (exp: any): any => {
  if (Array.isArray(exp)) return exp;
  if (!exp) return [];
  if (typeof exp === "string") {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(exp);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    // Parse line-separated format
    const lines = exp.split("\n").filter((line: string) => line.trim());
    const items = [];
    let currentItem: any = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if this looks like a title (common job titles)
      if (
        trimmed.includes("Developer") ||
        trimmed.includes("Engineer") ||
        trimmed.includes("Manager") ||
        trimmed.includes("Designer") ||
        trimmed.includes("Lead") ||
        trimmed.includes("Senior") ||
        !trimmed.match(/\d{4}/)
      ) {
        if (currentItem) items.push(currentItem);
        currentItem = {
          title: trimmed,
          company: "",
          year: "",
          description: "",
        };
      } else if (trimmed.match(/\d{4}/)) {
        // Has year
        if (currentItem) {
          const parts = trimmed.split("|");
          currentItem.company = parts[0]?.trim() || "";
          currentItem.year = parts[1]?.trim() || "";
        }
      } else if (currentItem) {
        // Additional details
        currentItem.description =
          (currentItem.description ? currentItem.description + " " : "") +
          trimmed;
      }
    }

    if (currentItem) items.push(currentItem);
    return items.length > 0
      ? items
      : [{ title: exp, company: "", year: "", description: "" }];
  }
  return [];
};

export async function GET() {
  try {
    const { data, error } = await supabase.from("about").select("*").single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        {
          id: "default",
          about_text: "I'm a passionate full-stack developer...",
          education: [],
          experience: [],
        },
        { status: 200 },
      );
    }

    // Parse education and experience to ensure they're arrays
    const parsedData = {
      ...data,
      education: parseEducation(data.education),
      experience: parseExperience(data.experience),
    };

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { error: "Failed to fetch about section" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { about_text, profile_photo, education, experience, resume_link } =
      body;

    // Convert arrays to JSON strings if needed
    const educationData = Array.isArray(education)
      ? JSON.stringify(education)
      : education;
    const experienceData = Array.isArray(experience)
      ? JSON.stringify(experience)
      : experience;

    const { data: existing } = await supabase
      .from("about")
      .select("*")
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from("about")
        .update({
          about_text,
          profile_photo,
          education: educationData,
          experience: experienceData,
          resume_link,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select();
    } else {
      result = await supabase
        .from("about")
        .insert([
          {
            about_text,
            profile_photo,
            education: educationData,
            experience: experienceData,
            resume_link,
          },
        ])
        .select();
    }

    if (result.error) throw result.error;

    // Parse the result data
    const parsedResult = {
      ...result.data[0],
      education: parseEducation(result.data[0].education),
      experience: parseExperience(result.data[0].experience),
    };

    return NextResponse.json(parsedResult, { status: 200 });
  } catch (error) {
    console.error("Error saving about:", error);
    return NextResponse.json(
      { error: "Failed to save about section" },
      { status: 500 },
    );
  }
}
