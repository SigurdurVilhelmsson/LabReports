# Lab Report Assistant

An AI-powered web application for chemistry teachers and students in Iceland to grade and improve lab reports. Built with React, TypeScript, and Claude AI (Anthropic).

**Repository**: [SigurdurVilhelmsson/LabReports](https://github.com/SigurdurVilhelmsson/LabReports)

**Part of**: [Kvenno Chemistry Tools](https://kvenno.app) - A unified suite of chemistry education tools for Kvennaskólinn í Reykjavík

## Site Structure

This app is deployed as part of the **kvenno.app** multi-tool platform:

- **Live URLs**:
  - 2nd year: `kvenno.app/2-ar/lab-reports/`
  - 3rd year: `kvenno.app/3-ar/lab-reports/`

- **Site Navigation**:
  - Landing: `kvenno.app/` → Year selection
  - Year hubs: `kvenno.app/2-ar/` or `kvenno.app/3-ar/` → Tool selection
  - This app: Teacher/student mode selection

For complete site structure and design guidelines, see **[Kvenno_structure.md](./Kvenno_structure.md)**.

## What's New (November 2025)

### v3.2.0 - Documentation & Reliability (Nov 28)
- **Token Limit Increase** - Raised from 2000 → 8192 tokens to handle complex reports
- **JSON Repair Logic** - Automatic fixing of Claude's occasional JSON formatting quirks
- **Enhanced Debug Logging** - Better troubleshooting with detailed response analysis
- **Documentation Cleanup** - Consolidated and organized 21+ documentation files
- **nginx Buffering Guide** - Critical configuration for large API responses
- **Future Improvements Roadmap** - Detailed optimization suggestions for v3.3.0+
- **Comprehensive CHANGELOG** - Complete version history and upgrade guides

### v3.1.1 - DOCX/PDF Consistency (Nov 27-28)
- **Scoring Consistency** - Reduced variance from 10-15% → 2% between DOCX and PDF uploads
- **Filename Handling** - Fixed processing for files with multiple dots (e.g., `report.25.docx`)
- **Line Break Detection** - Enhanced PDF text extraction for character-level encodings
- **LibreOffice Fallback** - Robust PDF search for filename variations

### v3.1.0 - Pandoc Integration (Nov 19)
- **Pandoc Integration** - Replaced client-side Mammoth.js with server-side pandoc for better .docx processing
- **Better Equation Handling** - LaTeX equations now preserved natively in markdown format
- **Improved Document Conversion** - More accurate .docx parsing with pandoc's robust engine

### v3.0.0 - Major Release (Nov 16-18)
- **Drag & Drop File Upload** - Intuitive file upload with drag-and-drop support
- **PDF Support for Students** - Students can now upload PDF files (previously teacher-only)
- **Points-Based Grading** - Teacher mode shows detailed point breakdown and reasoning
- **Improved Storage** - Robust error handling for browser storage edge cases
- **Production Ready** - Full deployment on Linode with Node.js backend and nginx
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
- **Production Ready**: Deployed on Linode with Node.js backend server and nginx

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- An Anthropic API key ([Get one here](https://console.anthropic.com/))
- **Pandoc** for .docx processing (see installation below)
- **Backend server** for secure API key storage (see setup below)

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

   Edit `.env` for production deployment:
   ```bash
   # ⚠️ NEVER put API keys in VITE_ variables - they're exposed in client code!
   VITE_API_ENDPOINT=https://kvenno.app/api  # Your backend server
   VITE_BASE_PATH=/2-ar/lab-reports/
   VITE_APP_MODE=dual
   ```

   **For local development only** (not production), you can use direct API mode:
   ```bash
   # Development only - uncomment the line below (NOT for production!)
   # VITE_ANTHROPIC_API_KEY=your_development_key_here
   VITE_APP_MODE=dual
   ```

   ⚠️ **Security Warning**: See [KVENNO-STRUCTURE.md Section 3](KVENNO-STRUCTURE.md#3-backend-api--security) for why API keys must NEVER be in frontend environment variables.

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
├── server/                          # Backend Node.js server
│   ├── index.js                     # Express server with API endpoints
│   └── README.md                    # Server documentation
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
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript Node configuration
└── vite.config.ts                  # Vite build configuration
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
- **AI**: Claude Sonnet 4.5 (Anthropic)
- **File Processing**:
  - Pandoc (Word documents - server-side)
  - PDF.js (PDF files - client-side)
  - Browser FileReader API (images - client-side)
- **Server**: Node.js/Express backend, Linode with nginx (production)

## Deployment

**Important:** This application requires pandoc to be installed on the server. See [PANDOC_SETUP.md](./PANDOC_SETUP.md) for platform-specific setup instructions.

### Multi-Path Deployment

This app is **shared** across multiple year levels and deployed to multiple paths:
- **2nd year**: `/2-ar/lab-reports/`
- **3rd year**: `/3-ar/lab-reports/`

Each deployment requires separate builds with different `basename` configurations. See **[Kvenno_structure.md](./Kvenno_structure.md)** for complete deployment structure.

### Platform Support

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- **Linode/Ubuntu (Production)** - Install pandoc via `apt install pandoc`, run Express backend on port 8000

**Note**: For production deployment at kvenno.app, follow the unified deployment process outlined in [KVENNO-STRUCTURE.md](./KVENNO-STRUCTURE.md), especially:
- **Section 1**: Multi-path deployment structure
- **Section 3**: Backend API security requirements (CRITICAL!)
- **Section 9**: Complete deployment workflow

## Security

### ⚠️ CRITICAL Security Requirements

**This application REQUIRES a backend server for production deployments.**

❌ **NEVER do this:**
- Put API keys in `VITE_` prefixed environment variables
- Commit `.env` files with real API keys to git
- Deploy with `VITE_ANTHROPIC_API_KEY` set in production

✅ **ALWAYS do this:**
1. Set up a backend server (Node.js Express) to proxy Claude API calls
2. Store `CLAUDE_API_KEY` in backend `.env` (server-side only)
3. Set `VITE_API_ENDPOINT=https://kvenno.app/api` in frontend
4. Use backend endpoints `/api/analyze` and `/api/process-document`

### Why This Matters

Vite embeds `VITE_` prefixed variables into client JavaScript at build time. Anyone can:
1. Open browser DevTools
2. Search for your API key in the JavaScript bundle
3. Steal it and rack up huge bills on your account

**Complete setup guide**: See [KVENNO-STRUCTURE.md Section 3](KVENNO-STRUCTURE.md#3-backend-api--security) for:
- Backend server implementation
- systemd service configuration
- nginx proxy setup
- SSL/HTTPS configuration
- Security best practices

### Additional Security Notes

1. **Validate file uploads** - Prevent malicious files
2. **Enable CORS properly** - Restrict to your domain only
3. **Use HTTPS** - Always use SSL certificates in production
4. **Monitor API usage** - Watch for unusual activity
5. **Keep dependencies updated** - Regularly update packages

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
- For production: Ensure backend server is running with `CLAUDE_API_KEY` in `server/.env`
- For development: Set `VITE_ANTHROPIC_API_KEY` in `.env` (development only!)
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
| **Kvenno_structure.md** | Unified site structure, design system, navigation | **ALL developers** - Critical reference ⭐ |
| **CLAUDE.md** | AI assistant guide, architecture details, code conventions | AI assistants, maintainers |
| **DEPLOYMENT.md** | Platform-specific deployment instructions | DevOps, deployment |
| **MIGRATION.md** | v2 to v3 upgrade guide | Existing users migrating |
| **DEPENDENCY_UPDATE_PLAN.md** | Strategy for updating dependencies | Developers updating packages |
| **src/config/experiments/README.md** | Guide for creating experiments | Content creators |

**Important**: Before making any UI/design changes, consult **Kvenno_structure.md** for unified design system requirements (colors, buttons, navigation, etc.).

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