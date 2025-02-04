"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components";

type Profile = {
  name: string;
  skills: string;
};

export default function ProfilesPage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newProfile, setNewProfile] = useState<Profile>({
    name: "",
    skills: "",
  });
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <Loading />;
  }

  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.skills) {
      alert("Name and Skills are required.");
      return;
    }
    setProfiles([...profiles, newProfile]);
    setNewProfile({ name: "", skills: "" });
  };

  const handleDeleteProfile = (index: number) => {
    setProfiles(profiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profiles</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Name"
            value={newProfile.name}
            onChange={(e) =>
              setNewProfile({ ...newProfile, name: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Skills"
            value={newProfile.skills}
            onChange={(e) =>
              setNewProfile({ ...newProfile, skills: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleAddProfile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Profile
          </button>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Profile
          </label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select a profile</option>
            {profiles.map((profile, index) => (
              <option key={index} value={profile.name}>
                {profile.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border-b"
            >
              <div>
                <p className="font-bold">{profile.name}</p>
                <p>{profile.skills}</p>
              </div>
              <button
                onClick={() => handleDeleteProfile(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
