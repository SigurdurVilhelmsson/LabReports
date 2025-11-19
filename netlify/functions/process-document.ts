/**
 * Netlify function for processing documents with pandoc
 * Converts .docx files to markdown with LaTeX equations
 * Compatible with Netlify and standard Node.js servers
 */

import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import { IncomingMessage } from 'http';
import { Readable } from 'stream';

const execAsync = promisify(exec);

interface ProcessedDocument {
  content: string;
  format: 'markdown' | 'text';
  equations: string[];
}

/**
 * Check if pandoc is available in the system
 */
async function isPandocAvailable(): Promise<boolean> {
  try {
    await execAsync('pandoc --version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Process a .docx file using pandoc
 * Converts to markdown with LaTeX equations preserved
 */
async function processDocxWithPandoc(filePath: string): Promise<ProcessedDocument> {
  // Convert .docx to markdown with LaTeX math
  const command = `pandoc "${filePath}" --from=docx --to=markdown --wrap=none`;

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('Warning')) {
      console.error('Pandoc stderr:', stderr);
    }

    const content = stdout;

    // Extract equations (simple heuristic - look for LaTeX patterns)
    const equations: string[] = [];
    const inlineEquationPattern = /\$([^$]+)\$/g;
    const displayEquationPattern = /\$\$([^$]+)\$\$/g;

    let match;
    while ((match = displayEquationPattern.exec(content)) !== null) {
      equations.push(match[1].trim());
    }
    while ((match = inlineEquationPattern.exec(content)) !== null) {
      if (!equations.includes(match[1].trim())) {
        equations.push(match[1].trim());
      }
    }

    return {
      content,
      format: 'markdown',
      equations,
    };
  } catch (error) {
    console.error('Pandoc processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to process document: ${errorMessage}`);
  }
}

/**
 * Parse multipart form data from Netlify event
 */
function parseForm(event: HandlerEvent): Promise<{ fields: unknown; files: unknown }> {
  return new Promise((resolve, reject) => {
    // Create a fake IncomingMessage from the event
    const readable = new Readable();
    readable.push(event.body);
    readable.push(null);

    const req = Object.assign(readable, {
      headers: event.headers,
      method: event.httpMethod,
    }) as IncomingMessage;

    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
      allowEmptyFiles: false,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // CORS headers
  const allowedOrigins = [
    'https://www.kvenno.app',
    'https://lab-reports-assistant.vercel.app',
    'https://lab-reports.netlify.app',
    process.env.URL ? process.env.URL : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
    process.env.NODE_ENV === 'development' ? 'http://localhost:4173' : null,
  ].filter(Boolean) as string[];

  const origin = event.headers.origin || '';
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers':
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  };

  if (allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  }

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

  // Check if pandoc is available
  const pandocAvailable = await isPandocAvailable();
  if (!pandocAvailable) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Pandoc is not installed on this server. Please install pandoc to process documents.',
      }),
    };
  }

  let filePath: string | null = null;

  try {
    // Parse the multipart form data
    const { files } = await parseForm(event);

    // Get the uploaded file
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No file uploaded' }),
      };
    }

    const formidableFile = file as FormidableFile;
    filePath = formidableFile.filepath;

    // Check file type
    const fileName = formidableFile.originalFilename || '';
    if (!fileName.toLowerCase().endsWith('.docx')) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Only .docx files are supported' }),
      };
    }

    // Process the document with pandoc
    const result = await processDocxWithPandoc(filePath);

    // Clean up the uploaded file
    await unlink(filePath);
    filePath = null;

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Document processing error:', error);

    // Clean up file if it still exists
    if (filePath) {
      try {
        await unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to process document';
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: errorMessage,
      }),
    };
  }
};
