import Groq from 'groq-sdk';

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

const RECOMMENDATION_PROMPT = `You are an expert movie recommendation system. Your job is to understand user intent and recommend movies intelligently.

USER INPUT RULES:
- The user may provide EITHER a movie name (e.g., "Rush", "Interstellar") OR a description (e.g., "racing movies based on real stories", "dark emotional sci-fi in space")
- You must infer what the user means, regardless of input type

YOUR TASKS:
1. If the input is a movie name: Infer the genre, tone, themes, and style of that movie
2. If the input is a description: Understand the genre, tone, and preferences described
3. Based on your understanding, recommend 5 movies that match the user's intent
4. For each recommendation, provide:
   - A brief explanation (1-2 sentences) of why it matches
   - A quality rating out of 10 (based on critical acclaim, audience reception, and overall quality)

OUTPUT FORMAT:
You MUST include a rating for each movie. Format your response EXACTLY like this:

MOVIE 1: [Title]
Rating: [X]/10
Explanation: [Why this matches the user's request]

MOVIE 2: [Title]
Rating: [X]/10
Explanation: [Why this matches the user's request]

MOVIE 3: [Title]
Rating: [X]/10
Explanation: [Why this matches the user's request]

MOVIE 4: [Title]
Rating: [X]/10
Explanation: [Why this matches the user's request]

MOVIE 5: [Title]
Rating: [X]/10
Explanation: [Why this matches the user's request]

IMPORTANT:
- You MUST include "Rating: X/10" for EVERY movie (where X is a number from 1-10)
- Ratings should reflect the movie's overall quality, critical acclaim, and audience reception
- Keep explanations concise but insightful (1-2 sentences)
- Focus on what makes each movie a good match for what the user is looking for`;

export async function getRecommendationsFromLLM(userInput) {
  try {
    const groqClient = getGroqClient();
    
    console.log('Calling Groq API with input:', userInput.substring(0, 50) + '...');
    
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
      temperature: 0.7,
      max_tokens: 1000,
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
