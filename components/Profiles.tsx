import { useEffect, useState } from "react";
import { UserProfile } from "@/utils/types/userProfile";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState<UserProfile>({
    id: "",
    name: "",
    gitHub: "",
    title: "",
    skills: [],
    experience: "",
    summary: "",
  });
  useEffect(() => {
    fetch("/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
      })
      .catch((err) => {
        console.error("Failed to load profiles", err);
        setProfiles([]);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNewProfile((prev) => {
      if (name === "skills") {
        return {
          ...prev,
          skills: value.split(","),
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSaveProfile = () => {
    if (
      !newProfile.name ||
      !newProfile.title ||
      !newProfile.skills.length ||
      !newProfile.experience
    ) {
      alert("Name, Title, Skills, and Experience are required.");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/profiles/${editId}` : "/api/profiles";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProfile),
    })
      .then((res) => res.json())
      .then((data) => setProfiles(data.profiles))
      .catch((err) => console.error("Failed to save profile", err));

    setNewProfile({
      id: "",
      name: "",
      gitHub: "",
      title: "",
      skills: [],
      experience: "",
      summary: "",
    });
    setEditId(null);
  };

  const handleEditProfile = (profile: UserProfile) => {
    setNewProfile({
      ...profile,
      skills: Array.isArray(profile.skills) ? profile.skills : [],
    });
    setEditId(profile.id);
  };

  const handleDeleteProfile = (id: string) => {
    fetch(`/api/profiles/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setProfiles(data.profiles))
      .catch((err) => console.error("Failed to delete profile", err));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          👤 User Profiles
        </h2>

        {/* Profile Form */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                name="name"
                value={newProfile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional Title *
              </label>
              <input
                name="title"
                value={newProfile.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Senior Full Stack Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GitHub Profile URL
              </label>
              <input
                name="gitHub"
                value={newProfile.gitHub}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional Experience *
              </label>
              <input
                name="experience"
                value={newProfile.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="3 years"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Skills (comma separated) *
            </label>
            <input
              name="skills"
              value={newProfile.skills.join(",")}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="React, Node.js, TypeScript"
            />
            <p className="text-sm text-slate-500 mt-1">
              Separate skills with commas (React, Node.js, TypeScript)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Professional Summary
            </label>
            <textarea
              name="summary"
              value={newProfile.summary}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-32"
              placeholder="Write a brief professional summary..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex-1"
            >
              {editId ? "Update Profile" : "Add Profile"}
            </button>

            {editId && (
              <button
                onClick={() => {
                  setNewProfile({
                    id: "",
                    name: "",
                    gitHub: "",
                    title: "",
                    skills: [],
                    experience: "",
                    summary: "",
                  });
                  setEditId(null);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex-1"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Profiles List */}
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <p className="font-semibold text-slate-800 text-lg">
                  {profile.name}
                </p>
                <p className="text-slate-600 text-sm mb-2">
                  {profile.title}{" "}
                  {profile.experience &&
                    `, Experience: (${profile.experience})`}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {profile.gitHub && (
                  <a
                    href={profile.gitHub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    GitHub Profile
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProfile(profile)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
