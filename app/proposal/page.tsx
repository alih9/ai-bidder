"use client";

import { useEffect, useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components";
import profilesData from "@/data/profiles.json";
import { UserProfile } from "@/types/userProfile";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProposalPage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  const [proposal, setProposal] = useState("");
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoadingProposal, setIsLoadingProposal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    profile: "",
    jobTitle: "",
    jobDescription: "",
    jobSkills: "",
    clientQuestions: "",
  });

  useEffect(() => {
    setProfiles(profilesData?.profiles || []);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.jobTitle || !formData.jobDescription) {
      setError("Job Title and Job Description are required.");
      return;
    }

    const selectedProfile = profiles.find((p) => p.id === formData.profile);
    if (!selectedProfile) {
      setError("Please select a profile.");
      return;
    }

    setIsLoadingProposal(true);
    setError("");

    try {
      const model = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0.5,
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });

      const systemPrompt = `You are an assistant specialized in crafting personalized, client-focused Upwork proposals designed to maximize win rates by being clear, engaging, and tailored to the job, that feels as if a human has first carefully read the job description and then written this proposal.
<Input Details>
Job Title
Job Description
Skills Required (Infer if missing)
Client’s Questions (if given)
Profile
<Proposal Structure>
Opening: Greet the client with "Hi there," acknowledge their needs.
Tailored Solution: Explain how you’ll solve their problem and deliver key results.
Relevant Experience (If Needed): Highlight skills and past successes only if the job demands it.
Special Instructions: Follow any given client instructions carefully.
Call to Action: Invite discussion and close professionally that will attract client to make an action.
Answer Client’s Questions: Provide clear, thoughtful responses separately at the end and don’t write the question, only write the answer with question number.
Only provide the GitHub profile link if explicitly requested by the client.
<Requirements>
Maintain the job’s tone and style.
Be concise, persuasive, and under 150 tokens (unless answering questions).
Write naturally, focusing on client outcomes—not just listing skills or achievements—so it feels authentically human.
`;
      const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        [
          "human",
          `
          Job Title: {jobTitle}
          Job Description: {jobDescription}
          Skills Required: {jobSkills}
          Client Questions: {clientQuestions}
          Profile Information:
            - Name: {profileName}
            - GitHubProfileLink: {profileGitHub}
            - Title: {profileTitle}
            - Skills: {profileSkills}
            - Experience: {profileExperience}
          `,
        ],
      ]);
      console.log({ systemPrompt, promptTemplate });

      const chain = promptTemplate.pipe(model);

      const response = await chain.invoke({
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        jobSkills: formData.jobSkills || "To be inferred from job description",
        clientQuestions: formData.clientQuestions || "None provided",
        profileName: selectedProfile.name,
        profileGitHub: selectedProfile.gitHub,
        profileTitle: selectedProfile.title,
        profileSkills: selectedProfile.skills.join(", "),
        profileExperience: selectedProfile.experience,
      });
      console.log({ chain, response });
      setProposal(response.content.toString());
    } catch (err) {
      setError(
        `Failed to generate proposal. Please try again. ${
          err instanceof Error ? err.message : ""
        }`
      );
    } finally {
      setIsLoadingProposal(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return <Loading />;
  }
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      toast.success("Proposal copied to clipboard!");
    } catch (e) {
      console.log(e);
      toast.error("Failed to copy proposal");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          ✨ Proposal Generator
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Profile
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                required
              >
                <option value="">Choose a profile...</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} - {profile.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
                placeholder="Enter job title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-32"
                required
                placeholder="Paste job description here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Skills Required (optional)
              </label>
              <input
                type="text"
                name="jobSkills"
                value={formData.jobSkills}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="React, Node.js, TypeScript..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Client Questions (optional)
              </label>
              <textarea
                name="clientQuestions"
                value={formData.clientQuestions}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-24"
                placeholder="Add client's questions here..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoadingProposal}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {isLoadingProposal ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                "✨ Generate Proposal"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                Generated Proposal
              </h3>
              {proposal && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Copy className="h-5 w-5" />
                  <span>Copy</span>
                </button>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-200 h-[calc(100%-3rem)]">
              {proposal ? (
                <pre className="whitespace-pre-wrap font-sans text-slate-700 overflow-y-auto max-h-[600px]">
                  {proposal}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Your AI-generated proposal will appear here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
