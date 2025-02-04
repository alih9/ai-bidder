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

export async function GET() {
  const profiles = loadProfiles();
  return NextResponse.json(profiles);
}

export async function POST(req: Request) {
  try {
    const newProfile: UserProfile = await req.json();
    const profiles = loadProfiles();

    if (!newProfile.id) {
      newProfile.id = crypto.randomUUID();
    }
    newProfile.skills = newProfile.skills
      .join(",")
      .split(/[,]+/)
      .map((s) => s.trim())
      .filter((s) => s);

    profiles.push(newProfile);
    saveProfiles(profiles);

    return NextResponse.json(
      { message: "Profile added successfully", profiles },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
