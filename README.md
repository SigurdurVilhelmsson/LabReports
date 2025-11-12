# Lab Report Assistant

An AI-powered web application for chemistry teachers and students to grade and improve lab reports. Built with React, TypeScript, and Claude AI (Anthropic).

## Features

### 🎓 Teacher Mode
- **Automated Grading**: Upload multiple lab reports (.docx, .pdf, images) and get instant AI-powered analysis
- **Structured Evaluation**: Each report section is evaluated separately (Purpose, Theory, Materials, Procedure, Results, Conclusion, Signature)
- **Quality Assessment**: Three-tier quality rating (Good, Needs Improvement, Unsatisfactory)
- **Grade Suggestions**: AI provides suggested grades based on report quality
- **Batch Processing**: Analyze multiple reports simultaneously
- **CSV Export**: Export results for record-keeping
- **Session Management**: Save and load grading sessions

### 📚 Student Mode
- **Writing Assistance**: Get constructive feedback on lab reports
- **Detailed Feedback**: Section-by-section analysis with strengths, improvements, and suggestions
- **Encouragement**: Positive, supportive feedback to help students learn
- **Actionable Advice**: Specific next steps to improve the report
- **Multiple Format Support**: Submit reports as Word docs, PDFs, or images

### 🔧 Technical Features
- **PDF Support**: Full PDF parsing with image and equation extraction
- **Dual-Mode System**: Switch between teacher and student modes
- **Multilingual**: Icelandic UI with Icelandic feedback
- **Responsive Design**: Works on desktop and mobile
- **Session Persistence**: Browser storage for saving work
- **Modular Architecture**: Clean, maintainable codebase

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd LabReports
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   VITE_APP_MODE=dual
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   ```
   http://localhost:5173
   ```

## Usage

### For Teachers

1. **Select Mode**: Click "Kennari" (Teacher) button
2. **Choose Experiment**: Select the lab experiment from dropdown
3. **Upload Reports**: Upload student lab reports (.docx, .pdf, or images)
4. **Process**: Click "Greina skýrslur" (Analyze Reports)
5. **Review Results**: See detailed analysis for each report
6. **Export**: Download results as CSV or save session for later

### For Students

1. **Select Mode**: Click "Nemandi" (Student) button
2. **Choose Experiment**: Select your lab experiment
3. **Upload Report**: Upload your lab report draft
4. **Get Feedback**: Click "Greina skýrslur" to receive feedback
5. **Improve**: Read the suggestions and improve your report
6. **Resubmit**: Upload improved version to see progress

## Project Structure

```
LabReports/
├── api/                          # Serverless API functions
│   └── analyze.ts               # Vercel serverless function
├── netlify/functions/           # Netlify serverless functions
│   └── analyze.ts              # Netlify function
├── src/
│   ├── components/              # React components
│   │   ├── FileUpload.tsx      # File upload component
│   │   ├── Modal.tsx           # Modal dialogs
│   │   ├── SessionHistory.tsx  # Session management UI
│   │   ├── StudentFeedback.tsx # Student feedback display
│   │   ├── TeacherResults.tsx  # Teacher results display
│   │   └── Toast.tsx           # Toast notifications
│   ├── config/                  # Configuration files
│   │   ├── experiments.ts      # Experiment definitions
│   │   └── prompts.ts          # AI system prompts
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts            # All type definitions
│   ├── utils/                   # Utility functions
│   │   ├── api.ts              # API communication
│   │   ├── export.ts           # CSV export
│   │   ├── fileProcessing.ts   # File parsing (docx, pdf, images)
│   │   └── storage.ts          # Browser storage management
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── .env.example                 # Environment variables template
├── .gitignore                  # Git ignore rules
├── DEPLOYMENT.md               # Deployment guide
├── index.html                  # HTML template
├── netlify.toml                # Netlify configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript Node configuration
├── vercel.json                 # Vercel configuration
└── vite.config.ts              # Vite build configuration
```

## Configuration

### App Modes

Configure in `.env`:

- `VITE_APP_MODE=dual` - Both teacher and student modes available
- `VITE_APP_MODE=teacher` - Teacher mode only
- `VITE_APP_MODE=student` - Student mode only

### Adding New Experiments

Edit `src/config/experiments.ts`:

```typescript
export const experimentConfigs = {
  // ... existing experiments
  newExperiment: {
    id: 'newExperiment',
    title: 'New Experiment Title',
    year: 3,
    sections: [
      {
        id: 'section1',
        name: 'Section Name',
        description: 'What to look for',
        criteria: {
          good: 'Criteria for good',
          needsImprovement: 'Criteria for needs improvement',
          unsatisfactory: 'Criteria for unsatisfactory',
        },
      },
      // ... more sections
    ],
    gradeScale: ['10', '8', '5', '0'],
  },
};
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Claude Sonnet 4 (Anthropic)
- **File Processing**:
  - Mammoth (Word documents)
  - PDF.js (PDF files)
  - Browser FileReader API (images)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (Recommended)
- Netlify
- AWS Amplify
- Cloudflare Pages

## Security

### Important Security Notes

1. **Never commit API keys** - Use environment variables
2. **Use serverless functions in production** - Keeps API keys server-side
3. **Enable CORS properly** - Prevent unauthorized access
4. **Validate file uploads** - Prevent malicious files

### Recommended Production Setup

1. Deploy to Vercel/Netlify with serverless functions
2. Set `VITE_API_ENDPOINT` to your serverless function URL
3. Store `ANTHROPIC_API_KEY` only in platform environment variables
4. Never set `VITE_ANTHROPIC_API_KEY` in production

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Note**: PDF processing requires modern browser with Canvas API support.

## File Format Support

| Format | Extension | Notes |
|--------|-----------|-------|
| Word | .docx | Full text extraction |
| PDF | .pdf | Text + images (including equations) |
| Images | .jpg, .png, .gif, etc. | Direct vision analysis |

## Limitations

- PDF processing in browser may be slow for large files
- Complex equations may require high-quality images
- Browser storage has size limits (typically 5-10MB)
- API rate limits apply (based on Anthropic plan)

## Troubleshooting

### Common Issues

**"API key not configured"**
- Check `.env` file has `VITE_ANTHROPIC_API_KEY`
- Restart development server after adding env variables

**"Gat ekki lesið skrá" (Cannot read file)**
- Verify file format is supported
- Check file isn't corrupted
- Try converting to different format

**PDF images not showing equations**
- Ensure PDF has good quality
- Try increasing scale in `fileProcessing.ts`

**Storage not working**
- Clear browser cache
- Check browser allows local storage
- Try different browser

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is provided as-is for educational purposes.

## Credits

- Built with [Claude](https://www.anthropic.com/claude) by Anthropic
- UI components from [Lucide React](https://lucide.dev/)
- PDF processing with [PDF.js](https://mozilla.github.io/pdf.js/)
- Word document parsing with [Mammoth.js](https://github.com/mwilliamson/mammoth.js)

## Support

For issues and questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review this README for usage instructions
- Open an issue on GitHub

---

**Made with ❤️ for chemistry education in Iceland**