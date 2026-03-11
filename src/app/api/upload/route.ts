import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase credentials" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "profile-photos";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 },
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "-")
      .toLowerCase();
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`Uploading file to: ${filePath}`);

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, Buffer.from(fileBuffer), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        {
          error: `Upload failed: ${uploadError.message}`,
          details: uploadError,
        },
        { status: 500 },
      );
    }

    if (!data) {
      console.error("No data returned from Supabase upload");
      return NextResponse.json(
        { error: "Upload returned no data" },
        { status: 500 },
      );
    }

    console.log("File uploaded successfully:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      console.error("Failed to get public URL");
      return NextResponse.json(
        { error: "Failed to generate public URL" },
        { status: 500 },
      );
    }

    console.log("Public URL generated:", urlData.publicUrl);

    return NextResponse.json(
      {
        url: urlData.publicUrl,
        path: filePath,
        message: "File uploaded successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
