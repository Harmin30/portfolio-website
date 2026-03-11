import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const response = NextResponse.json(data || [], { status: 200 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, tech_stack, github_url, live_url } =
      body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Get the highest display_order to set new project's order
    const { data: existingProjects } = await supabase
      .from("projects")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);

    const nextOrder =
      existingProjects && existingProjects.length > 0
        ? (existingProjects[0]?.display_order ?? 0) + 1
        : 0;

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          description,
          image,
          tech_stack: Array.isArray(tech_stack) ? tech_stack : [],
          github_url,
          live_url,
          display_order: nextOrder,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projects: projectOrders } = body; // Array of {id, display_order}

    if (!Array.isArray(projectOrders)) {
      return NextResponse.json(
        { error: "Expected projects array" },
        { status: 400 },
      );
    }

    // Update all projects with their new order
    const updates = projectOrders.map(
      (p: { id: string; display_order: number }) =>
        supabase
          .from("projects")
          .update({
            display_order: p.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", p.id),
    );

    const results = await Promise.all(updates);

    // Check for errors
    for (const result of results) {
      if (result.error) throw result.error;
    }

    return NextResponse.json(
      { message: "Project order updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating project order:", error);
    return NextResponse.json(
      { error: "Failed to update project order" },
      { status: 500 },
    );
  }
}
