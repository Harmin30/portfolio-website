import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { paths } = await request.json();

  try {
    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
      }
    }

    return NextResponse.json(
      { message: "Pages revalidated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate pages" },
      { status: 500 },
    );
  }
}
