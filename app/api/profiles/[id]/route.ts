import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { UserProfile } from "@/utils/types/userProfile";

const filePath = path.join(process.cwd(), "data", "profiles.json");

const loadProfiles = (): UserProfile[] => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as UserProfile[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const saveProfiles = (profiles: UserProfile[]) => {
  fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2));
};

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract ID from URL
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updatedProfile: UserProfile = await req.json();
    const profiles = loadProfiles();

    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    updatedProfile.skills = updatedProfile.skills
      .join(",")
      .split(/[,]+/)
      .map((s) => s.trim())
      .filter((s) => s);

    profiles[index] = { ...updatedProfile, id };

    saveProfiles(profiles);

    return NextResponse.json({
      message: "Profile updated successfully",
      profiles,
    });
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

    let profiles = loadProfiles();
    const initialLength = profiles.length;
    profiles = profiles.filter((profile) => profile.id !== id);

    if (profiles.length === initialLength) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    saveProfiles(profiles);
    return NextResponse.json({
      message: "Profile deleted successfully",
      profiles,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete profile" + error },
      { status: 500 }
    );
  }
}
