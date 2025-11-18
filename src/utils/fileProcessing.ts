import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import html2canvas from 'html2canvas';
import { FileContent } from '@/types';

// Configure PDF.js worker - import from node_modules and let Vite handle it
// This ensures the worker is bundled and served from the same domain
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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
 * Extract text and images from a Word document (.docx)
 * Converts the document to HTML and renders it to images to capture all content including equations
 */
const extractFromDocx = async (file: File): Promise<FileContent> => {
  const arrayBuffer = await file.arrayBuffer();

  // Convert to HTML to preserve formatting and equations
  const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = htmlResult.value;

  // Extract plain text as well for text-based analysis
  const textResult = await mammoth.extractRawText({ arrayBuffer });
  const plainText = textResult.value;

  // Create a temporary container to render the HTML
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '816px'; // Standard A4 width at 96 DPI (8.5 inches)
  container.style.padding = '96px'; // 1 inch padding
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '12pt';
  container.style.lineHeight = '1.5';
  container.innerHTML = htmlContent;

  document.body.appendChild(container);

  try {
    const images: Array<{ data: string; mediaType: string }> = [];

    // Calculate how to split into pages (approximate A4 height)
    const pageHeight = 1056; // Standard A4 height at 96 DPI (11 inches)
    const totalHeight = container.scrollHeight;
    const numPages = Math.ceil(totalHeight / pageHeight);

    // Split content into multiple pages if needed
    for (let i = 0; i < numPages; i++) {
      // Create a clone of the container for this page
      const pageContainer = container.cloneNode(true) as HTMLElement;
      pageContainer.style.position = 'absolute';
      pageContainer.style.left = '-9999px';
      pageContainer.style.top = `${-i * pageHeight}px`;
      pageContainer.style.height = `${pageHeight}px`;
      pageContainer.style.overflow = 'hidden';

      document.body.appendChild(pageContainer);

      // Render this page to canvas
      const canvas = await html2canvas(pageContainer, {
        scale: 2, // Higher resolution for better quality
        logging: false,
        useCORS: true,
      });

      // Clean up page container
      document.body.removeChild(pageContainer);

      // Convert to base64
      const imageData = canvas.toDataURL('image/png');
      const base64Data = imageData.split(',')[1];

      images.push({
        data: base64Data,
        mediaType: 'image/png',
      });
    }

    return {
      type: 'docx',
      data: plainText,
      images: images,
    };
  } finally {
    // Clean up: remove the temporary container
    document.body.removeChild(container);
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
