import { ProposalForm } from "@/utils/types/proposalForm";
import { UserProfile } from "@/utils/types/userProfile";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

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
const chatOpenAIInvoke = async (
  formData: ProposalForm,
  selectedProfile: UserProfile
) => {
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
  return response.content.toString();
};

export { chatOpenAIInvoke };
