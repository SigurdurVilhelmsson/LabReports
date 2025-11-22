/**
 * Express.js backend server for LabReports on traditional Linux servers
 * Handles API endpoints that were designed for serverless platforms
 * Compatible with Ubuntu 24.04 + nginx
 */

import express from 'express';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink } from 'fs/promises';

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
const allowedOrigins = [
  'https://kvenno.app',
  'https://www.kvenno.app',
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Check if pandoc is available
 */
async function isPandocAvailable() {
  try {
    await execAsync('pandoc --version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Process .docx file using pandoc
 */
async function processDocxWithPandoc(filePath) {
  const command = `pandoc "${filePath}" --from=docx --to=markdown --wrap=none`;

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('Warning')) {
      console.error('Pandoc stderr:', stderr);
    }

    const content = stdout;

    // Extract equations
    const equations = [];
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
    throw new Error(`Failed to process document: ${error.message}`);
  }
}

/**
 * Parse multipart form data
 */
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB
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

/**
 * API endpoint: Process .docx documents
 */
app.post('/api/process-document', async (req, res) => {
  let filePath = null;

  try {
    // Check if pandoc is available
    const pandocAvailable = await isPandocAvailable();
    if (!pandocAvailable) {
      return res.status(500).json({
        error: 'Pandoc is not installed on this server. Please install pandoc.',
      });
    }

    // Parse form data
    const { files } = await parseForm(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = file.filepath;
    const fileName = file.originalFilename || '';

    if (!fileName.toLowerCase().endsWith('.docx')) {
      return res.status(400).json({ error: 'Only .docx files are supported' });
    }

    // Process with pandoc
    const result = await processDocxWithPandoc(filePath);

    // Clean up
    await unlink(filePath);
    filePath = null;

    return res.json(result);
  } catch (error) {
    console.error('Document processing error:', error);

    // Clean up file if it exists
    if (filePath) {
      try {
        await unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }

    return res.status(500).json({
      error: error.message || 'Failed to process document',
    });
  }
});

/**
 * API endpoint: Analyze with Claude
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const { content, systemPrompt, mode } = req.body;

    // Validate request
    if (!content || !systemPrompt || !mode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (mode !== 'teacher' && mode !== 'student') {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    if (typeof systemPrompt !== 'string' || systemPrompt.length > 50000) {
      return res.status(400).json({ error: 'Invalid systemPrompt' });
    }

    // Get API key
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('CLAUDE_API_KEY not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Call Anthropic API with timeout (55s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
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
        return res.status(response.status).json({
          error: error.error?.message || 'API request failed',
        });
      }

      const data = await response.json();
      return res.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('Request timeout');
        return res.status(504).json({
          error: 'Request timeout - greining tók of langan tíma',
        });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend API running on http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
