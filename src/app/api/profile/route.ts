import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function GET() {
  try {
    const { data, error } = await supabase.from("profile").select("*").single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is fine
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        {
          id: "default",
          name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "",
          title: process.env.NEXT_PUBLIC_PORTFOLIO_TITLE || "",
          bio: "Full Stack Developer",
          github: process.env.NEXT_PUBLIC_PORTFOLIO_GITHUB,
          linkedin: process.env.NEXT_PUBLIC_PORTFOLIO_LINKEDIN,
          twitter: process.env.NEXT_PUBLIC_PORTFOLIO_TWITTER,
          email: process.env.NEXT_PUBLIC_PORTFOLIO_EMAIL,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, bio, github, linkedin, twitter, email, hero_image } =
      body;

    // First, check if profile exists
    const { data: existing } = await supabase
      .from("profile")
      .select("*")
      .single();

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from("profile")
        .update({
          name,
          title,
          bio,
          github,
          linkedin,
          twitter,
          email,
          hero_image,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select();
    } else {
      // Create new
      result = await supabase
        .from("profile")
        .insert([
          {
            name,
            title,
            bio,
            github,
            linkedin,
            twitter,
            email,
            hero_image,
          },
        ])
        .select();
    }

    if (result.error) throw result.error;

    return NextResponse.json(result.data[0], { status: 200 });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 },
    );
  }
}
