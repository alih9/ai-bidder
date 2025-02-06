import { NextResponse } from "next/server";
import { UserProfile } from "@/utils/types/userProfile";
import { supabase } from "@/lib/supabase";

// Update profile
const updateProfile = async (id: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select();

  return { data: data?.[0], error };
};

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract ID from URL
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const profile: Partial<UserProfile> = await req.json();

    profile.skills =
      profile?.skills?.length && profile?.skills?.length > 0
        ? profile.skills
            .join(",")
            .split(/[,]+/)
            .map((s) => s.trim())
            .filter((s) => s)
        : [];

    const { data, error } = await updateProfile(id, profile);

    return NextResponse.json({
      message: "Profile updated successfully",
      data,
    });
    if (error) throw error;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" + error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({
      message: "Profile deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete profile: ${error}` },
      { status: 500 }
    );
  }
}
