import { FileContent, AnalysisResult, StudentFeedback, ExperimentConfig, AppMode } from '@/types';
import { buildTeacherSystemPrompt, buildStudentSystemPrompt } from '@/config/prompts';

const API_TIMEOUT = 30000; // 30 seconds

// Anthropic API response types
interface AnthropicTextContent {
  type: 'text';
  text: string;
}

interface AnthropicResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: AnthropicTextContent[];
  model: string;
  stop_reason: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Build Claude API message content from file content
 */
const buildMessageContent = (content: FileContent) => {
  if (content.type === 'image') {
    return [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: content.mediaType!,
          data: content.data,
        },
      },
      {
        type: 'text',
        text: 'Read this lab report and analyze it.',
      },
    ];
  }

  if (content.type === 'pdf' && content.images && content.images.length > 0) {
    // For PDFs with images, send both text and images to Claude
    return [
      {
        type: 'text',
        text: `Lab report text content:\n\n${content.data}`,
      },
      ...content.images.map((img) => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mediaType,
          data: img.data,
        },
      })),
      {
        type: 'text',
        text: 'Analyze this lab report including any equations or diagrams visible in the images.',
      },
    ];
  }

  // Text content
  return content.data;
};

/**
 * Call Claude API directly (for development/testing)
 * In production, this should be replaced with a serverless function call
 */
export const analyzeWithClaude = async (
  content: FileContent,
  experiment: ExperimentConfig,
  mode: AppMode,
  apiKey?: string
): Promise<AnthropicResponse> => {
  const systemPrompt =
    mode === 'teacher'
      ? buildTeacherSystemPrompt(experiment)
      : buildStudentSystemPrompt(experiment);

  const messageContent = buildMessageContent(content);

  // Student mode needs more tokens for detailed feedback
  const maxTokens = mode === 'student' ? 4000 : 2000;

  const endpoint = import.meta.env.VITE_API_ENDPOINT || 'https://api.anthropic.com/v1/messages';
  const useDirectAPI = !import.meta.env.VITE_API_ENDPOINT;

  if (useDirectAPI) {
    // Direct API call (requires API key in environment)
    const key = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error('API key not configured. Please set VITE_ANTHROPIC_API_KEY in .env file.');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: messageContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `API request failed (${response.status} ${response.statusText}): ${error.error?.message || 'Unknown error'}`
      );
    }

    return await response.json();
  } else {
    // Serverless function call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: messageContent,
        systemPrompt,
        mode,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error || errorMessage;
      } catch {
        // If response is not JSON, use text
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Ignore, use default message
        }
      }
      throw new Error(
        `API request failed (${response.status} ${response.statusText}): ${errorMessage}`
      );
    }

    return await response.json();
  }
};

/**
 * Process a single file and analyze it
 */
export const processFile = async (
  file: File,
  content: FileContent,
  experiment: ExperimentConfig,
  mode: AppMode
): Promise<AnalysisResult | StudentFeedback> => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout - skýrsla tók of langan tíma')), API_TIMEOUT)
  );

  const processPromise = async () => {
    const data = await analyzeWithClaude(content, experiment, mode);
    const resultText = data.content.find((item) => item.type === 'text')?.text || '';

    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gat ekki túlkað svar frá AI');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (mode === 'teacher') {
      return {
        filename: file.name,
        ...parsed,
      } as AnalysisResult;
    } else {
      return {
        filename: file.name,
        ...parsed,
      } as StudentFeedback;
    }
  };

  return await Promise.race([processPromise(), timeoutPromise]) as AnalysisResult | StudentFeedback;
};
