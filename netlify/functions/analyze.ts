/**
 * Netlify serverless function for Anthropic Claude API calls
 * This keeps the API key secure on the server side
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface AnalyzeRequest {
  content: any;
  systemPrompt: string;
  mode: 'teacher' | 'student';
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers with domain whitelist for security
  const allowedOrigins = [
    'https://lab-reports-assistant.vercel.app',
    'https://lab-reports.netlify.app',
    process.env.URL, // Netlify auto-provides this
    process.env.DEPLOY_PRIME_URL, // Netlify deploy previews
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:4173' : null,
  ].filter(Boolean) as string[];

  const origin = event.headers.origin || '';
  const corsHeaders = allowedOrigins.includes(origin)
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      }
    : {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { content, systemPrompt, mode } = JSON.parse(event.body || '{}') as AnalyzeRequest;

    // Validate request with type checking
    if (!content || !systemPrompt || !mode) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    if (mode !== 'teacher' && mode !== 'student') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid mode. Must be "teacher" or "student"' }),
      };
    }

    if (typeof systemPrompt !== 'string' || systemPrompt.length > 50000) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid systemPrompt' }),
      };
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    // Call Anthropic API with timeout protection (85s, leaving 5s buffer for 90s limit)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 85000);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5-20251101',
          max_tokens: mode === 'student' ? 4000 : 2000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: content,
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        console.error('Anthropic API error:', error);
        return {
          statusCode: response.status,
          headers: corsHeaders,
          body: JSON.stringify({ error: error.error?.message || 'API request failed' }),
        };
      }

      const data = await response.json();
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(data),
      };
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('Request timeout');
        return {
          statusCode: 504,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Request timeout - greining tók of langan tíma' }),
        };
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
