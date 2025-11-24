import * as pdfjsLib from 'pdfjs-dist';
import { FileContent } from '@/types';

// Configure PDF.js worker - import from node_modules and let Vite handle it
// This ensures the worker is bundled and served from the same domain
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Get API endpoint from environment or use default
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '/api';

// PDF.js types for text content items
interface PDFTextItem {
  str: string;
  dir?: string;
  width?: number;
  height?: number;
  transform?: number[];
  fontName?: string;
}

/**
 * Convert a file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Extract text from a Word document (.docx) using server-side pandoc
 * Sends the file to the server for processing and receives markdown with LaTeX equations
 */
const extractFromDocx = async (file: File): Promise<FileContent> => {
  // Create FormData to upload the file
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Send to server for processing
    const response = await fetch(`${API_ENDPOINT}/process-document`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process document');
    }

    const result = await response.json();

    // Return the processed content
    // The server returns: { content: string, format: 'markdown', equations: string[] }
    return {
      type: 'docx',
      data: result.text, // Markdown text with LaTeX equations
      mediaType: 'text/markdown',
    };
  } catch (error: any) {
    console.error('Error processing .docx file:', error);
    throw new Error(`Gat ekki lesið Word skjalið: ${error.message}`);
  }
};

/**
 * Extract text and images from a PDF file
 * This function extracts both text content and images (including equations rendered as images)
 */
const extractFromPdf = async (file: File): Promise<FileContent> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const images: Array<{ data: string; mediaType: string }> = [];
  let fullText = '';

  // Process each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // Extract text content
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => (item as PDFTextItem).str)
      .join(' ');
    fullText += pageText + '\n\n';

    // Render page to canvas to capture images and equations
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/png');
    const base64Data = imageData.split(',')[1];

    images.push({
      data: base64Data,
      mediaType: 'image/png',
    });

    // Clean up canvas to free memory
    canvas.width = 0;
    canvas.height = 0;
  }

  return {
    type: 'pdf',
    data: fullText.trim(),
    images: images,
  };
};

/**
 * Process an image file
 */
const extractFromImage = async (file: File): Promise<FileContent> => {
  const base64 = await fileToBase64(file);
  return {
    type: 'image',
    data: base64,
    mediaType: file.type,
  };
};

/**
 * Main function to extract content from any supported file type
 * Supports: .docx, .pdf, and image files
 */
export const extractTextFromFile = async (file: File): Promise<FileContent | null> => {
  try {
    const fileName = file.name.toLowerCase();

    // Word documents
    if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractFromDocx(file);
    }

    // PDF files
    if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractFromPdf(file);
    }

    // Image files
    if (file.type.startsWith('image/')) {
      return await extractFromImage(file);
    }

    console.error('Unsupported file type:', file.type);
    return null;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return null;
  }
};

/**
 * Validate file type
 */
export const isValidFileType = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.docx', '.pdf'];
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
  ];

  return (
    validExtensions.some(ext => fileName.endsWith(ext)) ||
    validMimeTypes.includes(file.type) ||
    file.type.startsWith('image/')
  );
};

/**
 * Get file type description for UI
 */
export const getFileTypeDescription = (file: File): string => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.docx')) return 'Word Document';
  if (fileName.endsWith('.pdf')) return 'PDF Document';
  if (file.type.startsWith('image/')) return 'Image';

  return 'Unknown';
};
