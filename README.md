# Lab Report Assistant

An AI-powered web application for chemistry teachers and students in Iceland to grade and improve lab reports. Built with React, TypeScript, and Claude AI (Anthropic).

**Repository**: [SigurdurVilhelmsson/LabReports](https://github.com/SigurdurVilhelmsson/LabReports)

## What's New (November 2025)

This project has recently received significant enhancements:

- **Pandoc Integration (Nov 19)** - Replaced client-side Mammoth.js with server-side pandoc for better .docx processing
- **Better Equation Handling** - LaTeX equations now preserved natively in markdown format
- **Improved Document Conversion** - More accurate .docx parsing with pandoc's robust engine
- **Drag & Drop File Upload** - Intuitive file upload with drag-and-drop support
- **PDF Support for Students** - Students can now upload PDF files (previously teacher-only)
- **Points-Based Grading** - Teacher mode shows detailed point breakdown and reasoning
- **Improved Storage** - Robust error handling for browser storage edge cases
- **Production Ready** - Full deployment support for Vercel, Netlify, and Linode
- **Comprehensive Documentation** - Detailed guides for developers and AI assistants

## Features

### 🎓 Teacher Mode
- **Automated Grading**: Upload multiple lab reports (.docx, .pdf, images) and get instant AI-powered analysis
- **Points-Based Evaluation**: Each report section is evaluated separately with detailed point breakdown
- **Structured Feedback**: Purpose, Theory, Materials, Procedure, Results, Conclusion, and Signature sections
- **Quality Assessment**: Three-tier quality rating (Good, Needs Improvement, Unsatisfactory)
- **Detailed Reasoning**: AI provides specific reasoning for each grade and point allocation
- **Batch Processing**: Analyze multiple reports simultaneously
- **CSV Export**: Export results with full point breakdown for record-keeping
- **Session Management**: Save and load grading sessions

### 📚 Student Mode
- **Writing Assistance**: Get constructive feedback on lab reports
- **Detailed Feedback**: Section-by-section analysis with strengths, improvements, and suggestions
- **Encouragement**: Positive, supportive feedback in Icelandic to help students learn
- **Actionable Advice**: Specific next steps to improve the report
- **Multiple Format Support**: Submit reports as Word docs (.docx), PDFs (.pdf), or images (.jpg, .png, etc.)
- **Equation Recognition**: LaTeX equations preserved natively from .docx files via pandoc

### 🔧 Technical Features
- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **PDF Support**: Full PDF parsing with image and equation extraction
- **Dual-Mode System**: Switch between teacher and student modes
- **Multilingual**: Icelandic UI with Icelandic feedback
- **Responsive Design**: Works on desktop and mobile
- **Session Persistence**: Robust browser storage with graceful error handling
- **Modular Architecture**: Clean, maintainable codebase with TypeScript
- **Production Ready**: Deployed on Vercel/Netlify with serverless functions

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- An Anthropic API key ([Get one here](https://console.anthropic.com/))
- **Pandoc** for .docx processing (see installation below)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SigurdurVilhelmsson/LabReports.git
   cd LabReports
   ```

2. **Install pandoc** (required for .docx processing):

   **macOS:**
   ```bash
   brew install pandoc
   ```

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update && sudo apt install pandoc
   ```

   **Windows:**
   ```powershell
   choco install pandoc
   ```

   Or download from [pandoc.org](https://pandoc.org/installing.html)

   Verify installation:
   ```bash
   pandoc --version
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   VITE_APP_MODE=dual
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**:
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
├── api/                              # Serverless API functions
│   └── analyze.ts                   # Vercel serverless function
├── netlify/functions/               # Netlify serverless functions
│   └── analyze.ts                  # Netlify function
├── src/
│   ├── components/                  # React components
│   │   ├── FileUpload.tsx          # File upload with drag-and-drop
│   │   ├── Landing.tsx             # Landing page component
│   │   ├── Modal.tsx               # SaveDialog, ConfirmDialog components
│   │   ├── SessionHistory.tsx      # Session management UI
│   │   ├── StudentFeedback.tsx     # Student feedback display
│   │   ├── StudentHome.tsx         # Student home page
│   │   ├── TeacherResults.tsx      # Teacher results table
│   │   ├── Toast.tsx               # Toast notifications
│   │   └── WorksheetView.tsx       # Worksheet viewer
│   ├── config/
│   │   ├── experiments/            # Experiment definitions (MODULAR)
│   │   │   ├── index.ts           # Exports all experiments
│   │   │   ├── jafnvaegi.ts       # Equilibrium experiment
│   │   │   ├── _template.ts       # Template for new experiments
│   │   │   └── README.md          # Experiment creation guide
│   │   └── prompts.ts             # System prompts for Claude
│   ├── pages/
│   │   ├── StudentPage.tsx        # Student mode page
│   │   └── TeacherPage.tsx        # Teacher mode page
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts                # All type definitions
│   ├── utils/                       # Utility functions
│   │   ├── api.ts                  # Claude API communication
│   │   ├── export.ts               # CSV export functionality
│   │   ├── fileProcessing.ts       # File parsing (docx, pdf, images)
│   │   └── storage.ts              # Browser localStorage management
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles + Tailwind
│   └── vite-env.d.ts               # Vite environment types
├── chemistry-report-helper.tsx      # LEGACY: v1 single-file student version
├── teacher-report-grader-v3.tsx     # LEGACY: v2 single-file teacher version
├── .env.example                     # Environment variables template
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore                      # Git ignore rules
├── CLAUDE.md                       # AI assistant guide
├── DEPENDENCY_UPDATE_PLAN.md       # Dependency upgrade strategy
├── DEPLOYMENT.md                   # Deployment guide
├── MIGRATION.md                    # v2 to v3 migration guide
├── README.md                       # User-facing documentation (this file)
├── index.html                      # HTML entry point
├── netlify.toml                    # Netlify deployment config
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript Node configuration
├── vite.config.ts                  # Vite build configuration
└── vercel.json                     # Vercel deployment config
```

## Configuration

### App Modes

Configure in `.env`:

- `VITE_APP_MODE=dual` - Both teacher and student modes available
- `VITE_APP_MODE=teacher` - Teacher mode only
- `VITE_APP_MODE=student` - Student mode only

### Adding New Experiments

The project uses a **modular experiment structure** where each experiment is defined in its own file.

**Step 1:** Create a new experiment file in `src/config/experiments/`:

```bash
# Use the template as a starting point
cp src/config/experiments/_template.ts src/config/experiments/my-experiment.ts
```

**Step 2:** Define your experiment in the new file:

```typescript
import type { ExperimentConfig } from '../../types';

export const myExperiment: ExperimentConfig = {
  id: 'myExperiment',
  title: 'My Experiment Title',
  year: 3,
  worksheet: {
    // Optional: Include worksheet information
    title: 'Worksheet Title',
    sections: [...],
  },
  sections: [
    {
      id: 'section1',
      name: 'Section Name',
      description: 'What to look for',
      maxPoints: 5,  // Points for this section
      criteria: {
        good: 'Criteria for excellent work',
        needsImprovement: 'Criteria for acceptable work',
        unsatisfactory: 'Criteria for poor work',
      },
    },
    // ... more sections
  ],
  gradeScale: ['10', '8', '5', '0'],
};
```

**Step 3:** Register the experiment in `src/config/experiments/index.ts`:

```typescript
import { myExperiment } from './my-experiment';

export const experimentConfigs: ExperimentConfigs = {
  jafnvaegi,
  myExperiment,  // Add your experiment here
};
```

**For detailed guidance**, see `src/config/experiments/README.md` which includes:
- Complete experiment structure explanation
- Section configuration best practices
- Point distribution guidelines
- Chemical accuracy validation tips

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
  - Pandoc (Word documents - server-side)
  - PDF.js (PDF files - client-side)
  - Browser FileReader API (images - client-side)
- **Server**: Vercel/Netlify serverless functions, Linode with nginx (production)

## Deployment

**Important:** This application requires pandoc to be installed on the server. See [PANDOC_SETUP.md](./PANDOC_SETUP.md) for platform-specific setup instructions.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (Recommended) - Requires pandoc setup
- Netlify - Requires pandoc setup
- Linode/Ubuntu (Production) - Install via `apt install pandoc`
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

## Documentation

This project includes comprehensive documentation for different audiences:

| Document | Purpose | Audience |
|----------|---------|----------|
| **README.md** (this file) | User guide, quick start, general usage | End users, new developers |
| **CLAUDE.md** | AI assistant guide, architecture details, code conventions | AI assistants, maintainers |
| **DEPLOYMENT.md** | Platform-specific deployment instructions | DevOps, deployment |
| **MIGRATION.md** | v2 to v3 upgrade guide | Existing users migrating |
| **DEPENDENCY_UPDATE_PLAN.md** | Strategy for updating dependencies | Developers updating packages |
| **src/config/experiments/README.md** | Guide for creating experiments | Content creators |

### Legacy Files

The project includes legacy single-file versions for reference:

- **chemistry-report-helper.tsx** - Original v1 student-only version (823 lines)
- **teacher-report-grader-v3.tsx** - Original v2 teacher-only version (824 lines)

**Note:** These files are kept for migration reference only. All new development happens in the modular `src/` directory structure.

### Migration from v2

If you're upgrading from the v2 single-file version, see **MIGRATION.md** for:
- Step-by-step migration guide
- Breaking changes and compatibility notes
- Data migration instructions for saved sessions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**For AI assistants and detailed code conventions**, see **CLAUDE.md**.

## Version & Status

- **Current Version**: 3.0.0
- **Status**: Actively maintained
- **Last Updated**: November 2025
- **License**: Provided as-is for educational purposes

See [MIGRATION.md](./MIGRATION.md) for information about upgrading from v2.x.

## Credits

- Built with [Claude](https://www.anthropic.com/claude) by Anthropic
- UI components from [Lucide React](https://lucide.dev/)
- PDF processing with [PDF.js](https://mozilla.github.io/pdf.js/)
- Word document parsing with [Mammoth.js](https://github.com/mwilliamson/mammoth.js)

## Support

For issues and questions:
- **General usage** - Review this README
- **Deployment issues** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Adding experiments** - See [src/config/experiments/README.md](./src/config/experiments/README.md)
- **Code contributions** - See [CLAUDE.md](./CLAUDE.md)
- **Migrating from v2** - See [MIGRATION.md](./MIGRATION.md)
- **Updating dependencies** - See [DEPENDENCY_UPDATE_PLAN.md](./DEPENDENCY_UPDATE_PLAN.md)
- Open an issue on GitHub for bug reports or feature requests

---

**Made with ❤️ for chemistry education in Iceland**