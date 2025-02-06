import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/utils/types/userProfile";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Profile not found: ${error}` },
      { status: 404 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const profileData: UserProfile = await req.json();

    profileData.skills = profileData.skills
      .join(",")
      .split(/[,]+/)
      .map((s) => s.trim())
      .filter((s) => s);

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          name: profileData.name,
          github_url: profileData.github_url,
          title: profileData.title,
          skills: profileData.skills,
          experience: profileData.experience,
          summary: profileData.summary,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Profile creation failed: ${error}` },
      { status: 500 }
    );
  }
}
