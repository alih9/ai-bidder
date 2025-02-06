export interface UserProfile {
  id?: string;
  name: string;
  github_url: string;
  title: string;
  skills: string[];
  experience: string;
  summary: string;
  created_at?: string;
  updated_at?: string;
}
