import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching certificate:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch certificate" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      issuer,
      date_obtained,
      date_from,
      date_to,
      certificate_url,
      description,
      is_featured,
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
      .update({
        title,
        issuer,
        date_obtained: date_obtained || null,
        date_from: date_from || null,
        date_to: date_to || null,
        certificate_url,
        description: description || null,
        is_featured: is_featured || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error: any) {
    console.error("Error updating certificate:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to update certificate" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("certificates").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting certificate:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete certificate" },
      { status: 500 },
    );
  }
}
