import Groq from 'groq-sdk';

/**
 * LLM Service - The Brain of the System
 * 
 * This service is the SINGLE SOURCE OF TRUTH for all recommendation logic.
 * 
 * The LLM is responsible for:
 * 1. Understanding user input (movie name OR description)
 * 2. Inferring genre, tone, and intent
 * 3. Deciding which movies to recommend
 * 4. Generating explanations
 * 
 * NO rule-based logic is used here.
 * NO keyword matching.
 * NO hardcoded lists.
 * 
 * The prompt is designed to make the LLM handle all decision-making.
 */

// Lazy initialization - only create Groq client when needed
// This ensures dotenv.config() has already loaded environment variables
let groq = null;

function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

/**
 * AI-FIRST PROMPT DESIGN
 * 
 * This prompt instructs the LLM to:
 * - Accept either a movie name or a description
 * - Infer genre/theme automatically
 * - Make intelligent recommendations
 * - Provide clear explanations
 * 
 * The LLM's understanding and reasoning is what drives recommendations.
 */
const RECOMMENDATION_PROMPT = `You are an expert movie recommendation system. Your job is to understand user intent and recommend movies intelligently.

USER INPUT RULES:
- The user may provide EITHER a movie name (e.g., "Rush", "Interstellar") OR a description (e.g., "racing movies based on real stories", "dark emotional sci-fi in space")
- You must infer what the user means, regardless of input type

YOUR TASKS:
1. If the input is a movie name: Infer the genre, tone, themes, and style of that movie
2. If the input is a description: Understand the genre, tone, and preferences described
3. Based on your understanding, recommend 5 movies that match the user's intent
4. For each recommendation, provide a brief explanation (1-2 sentences) of why it matches

OUTPUT FORMAT:
Provide your response as clean, readable text. Format it like this:

MOVIE 1: [Title]
Explanation: [Why this matches the user's request]

MOVIE 2: [Title]
Explanation: [Why this matches the user's request]

... (continue for 5 movies)

Keep explanations concise but insightful. Focus on what makes each movie a good match for what the user is looking for.`;

export async function getRecommendationsFromLLM(userInput) {
  try {
    const groqClient = getGroqClient();
    
    console.log('Calling Groq API with input:', userInput.substring(0, 50) + '...');
    
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Latest Groq model (released Dec 2024)
      messages: [
        {
          role: 'system',
          content: RECOMMENDATION_PROMPT,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      temperature: 0.7, // Balance between creativity and consistency
      max_tokens: 800, // Enough for 5 recommendations with explanations
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from LLM');
    }

    console.log('✓ Groq API response received');
    return response.trim();
  } catch (error) {
    console.error('LLM Service Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    if (error.response) {
      console.error('Error response:', error.response);
    }
    throw error;
  }
}
