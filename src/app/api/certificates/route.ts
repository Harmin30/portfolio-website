import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("date_obtained", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error: any) {
    console.error("Error fetching certificates:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch certificates" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      issuer,
      date_obtained,
      date_from,
      date_to,
      certificate_url,
      description,
    } = body;

    // Check if either date_obtained OR date range (date_from AND date_to) is provided
    const hasDateObtained = !!date_obtained;
    const hasDateRange = !!date_from && !!date_to;

    if (
      !title ||
      !issuer ||
      (!hasDateObtained && !hasDateRange) ||
      !certificate_url
    ) {
      return NextResponse.json(
        {
          error:
            "Title, issuer, certificate URL, and either a date obtained or course duration (start & end dates) are required",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("certificates")
      .insert([
        {
          title,
          issuer,
          date_obtained: date_obtained || null,
          date_from: date_from || null,
          date_to: date_to || null,
          certificate_url,
          description: description || null,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating certificate:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to create certificate" },
      { status: 500 },
    );
  }
}
