import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface SkillMatch {
  skill: string;
  relevance: number;
  category: string;
}

export interface JobMatchResult {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export class AIService {
  /**
   * Extract skills from job description or user bio
   */
  static async extractSkills(text: string): Promise<SkillMatch[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert skill extraction AI. Extract technical skills, soft skills, and domain expertise from the provided text. 
            Return a JSON array of skills with their relevance (1-100) and category (technical, soft, domain, tool, language, framework, etc.).
            Focus on industry-standard skills that are relevant for job matching.`
          },
          {
            role: "user",
            content: `Extract skills from this text: "${text}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{"skills": []}');
      return result.skills || [];
    } catch (error) {
      console.error('AI skill extraction error:', error);
      return [];
    }
  }

  /**
   * Calculate job match score between candidate profile and job description
   */
  static async calculateJobMatch(
    candidateProfile: string,
    jobDescription: string,
    candidateSkills: string[]
  ): Promise<JobMatchResult> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert job matching AI. Analyze the compatibility between a candidate and a job posting.
            Provide a match score (0-100), list strengths, identify skill gaps, and give specific recommendations.
            Return JSON with: matchScore (number), strengths (array), gaps (array), recommendations (array).`
          },
          {
            role: "user",
            content: `
            Candidate Profile: ${candidateProfile}
            Candidate Skills: ${candidateSkills.join(', ')}
            Job Description: ${jobDescription}
            
            Analyze the match and provide detailed assessment.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        matchScore: result.matchScore || 0,
        strengths: result.strengths || [],
        gaps: result.gaps || [],
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error('AI job matching error:', error);
      return {
        matchScore: 0,
        strengths: [],
        gaps: [],
        recommendations: []
      };
    }
  }

  /**
   * Generate career recommendations based on user profile
   */
  static async generateCareerInsights(
    profile: string,
    skills: string[],
    experience: string[]
  ): Promise<{
    nextSteps: string[];
    skillRecommendations: string[];
    careerPath: string[];
    marketTrends: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a career guidance AI. Provide personalized career insights including next steps, 
            skill recommendations, potential career paths, and relevant market trends.
            Return JSON with: nextSteps, skillRecommendations, careerPath, marketTrends (all arrays).`
          },
          {
            role: "user",
            content: `
            Profile: ${profile}
            Current Skills: ${skills.join(', ')}
            Experience: ${experience.join(', ')}
            
            Provide comprehensive career guidance.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        nextSteps: result.nextSteps || [],
        skillRecommendations: result.skillRecommendations || [],
        careerPath: result.careerPath || [],
        marketTrends: result.marketTrends || []
      };
    } catch (error) {
      console.error('AI career insights error:', error);
      return {
        nextSteps: [],
        skillRecommendations: [],
        careerPath: [],
        marketTrends: []
      };
    }
  }

  /**
   * Optimize job posting for better visibility
   */
  static async optimizeJobPosting(jobTitle: string, jobDescription: string): Promise<{
    optimizedDescription: string;
    suggestedSkills: string[];
    improvementTips: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a job posting optimization AI. Improve job descriptions for better candidate matching 
            and attraction. Return JSON with: optimizedDescription, suggestedSkills, improvementTips.`
          },
          {
            role: "user",
            content: `
            Job Title: ${jobTitle}
            Job Description: ${jobDescription}
            
            Optimize this job posting for better results.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        optimizedDescription: result.optimizedDescription || jobDescription,
        suggestedSkills: result.suggestedSkills || [],
        improvementTips: result.improvementTips || []
      };
    } catch (error) {
      console.error('AI job optimization error:', error);
      return {
        optimizedDescription: jobDescription,
        suggestedSkills: [],
        improvementTips: []
      };
    }
  }

  /**
   * Generate professional profile summary
   */
  static async generateProfileSummary(
    name: string,
    experience: string[],
    skills: string[],
    bio?: string
  ): Promise<{
    summary: string;
    headline: string;
    strengthAreas: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional profile optimization AI. Create compelling profile summaries, headlines, 
            and identify strength areas. Return JSON with: summary, headline, strengthAreas.`
          },
          {
            role: "user",
            content: `
            Name: ${name}
            Experience: ${experience.join(', ')}
            Skills: ${skills.join(', ')}
            Bio: ${bio || 'Not provided'}
            
            Generate an optimized professional profile.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        summary: result.summary || '',
        headline: result.headline || '',
        strengthAreas: result.strengthAreas || []
      };
    } catch (error) {
      console.error('AI profile generation error:', error);
      return {
        summary: '',
        headline: '',
        strengthAreas: []
      };
    }
  }
}