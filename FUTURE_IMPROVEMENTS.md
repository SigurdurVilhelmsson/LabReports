# Future Improvements & Optimization Roadmap

This document outlines potential improvements and optimizations for the Lab Report Assistant application. These suggestions are based on the November 2025 debugging session and architectural review.

**Status**: Proposed (not yet implemented)
**Priority**: Low to Medium (current implementation is stable)
**Version**: For v3.3.0+ consideration

---

## Table of Contents

1. [High Priority Improvements](#high-priority-improvements)
2. [Code Quality & Maintainability](#code-quality--maintainability)
3. [Performance Optimizations](#performance-optimizations)
4. [User Experience Enhancements](#user-experience-enhancements)
5. [Developer Experience](#developer-experience)
6. [Infrastructure & Monitoring](#infrastructure--monitoring)
7. [Future Features](#future-features)

---

## High Priority Improvements

### 1. Token Limit Environment Variable

**Current State**: Token limits hardcoded to 8192 in both frontend and backend

**Proposed Change**:
```javascript
// Backend (server/index.js)
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '8192', 10);

// Use in API call:
max_tokens: MAX_TOKENS,
```

```bash
# Backend .env
MAX_TOKENS=8192
```

**Benefits**:
- Easy to adjust without code changes
- Can be tuned per deployment environment
- Facilitates A/B testing of token limits

**Effort**: Low (1 hour)
**Risk**: Very Low
**Priority**: Medium

---

### 2. JSON Repair Library

**Current State**: Basic trailing comma removal via regex

**Proposed Change**:
```bash
npm install json-repair
```

```typescript
// src/utils/api.ts
import { jsonrepair } from 'json-repair';

try {
  const repaired = jsonrepair(jsonText);
  const parsed = JSON.parse(repaired);
  return parsed;
} catch (parseError) {
  // Enhanced error handling
}
```

**Benefits**:
- Handles more JSON formatting issues:
  - Unescaped quotes
  - Missing commas
  - Missing closing brackets
  - Single quotes instead of double quotes
  - Comments in JSON
- More robust than manual regex patterns
- Well-tested library (npm package with 100k+ weekly downloads)

**Alternatives**:
- Claude's **Structured Outputs** (native JSON mode)
- JSON Schema validation with auto-repair

**Effort**: Low (2 hours)
**Risk**: Low (library is well-tested, can fallback to current method)
**Priority**: Medium

---

### 3. Debug Logging Configuration

**Current State**: Debug logging always enabled in backend

**Proposed Options**:

#### Option A: Environment Variable Toggle
```javascript
// server/index.js
const shouldLog = process.env.NODE_ENV !== 'production' ||
                  process.env.DEBUG_ANALYSIS === 'true';

if (shouldLog) {
  console.log('[Analysis] Response received:', { ... });
}
```

```bash
# Production .env
DEBUG_ANALYSIS=false  # or omit to disable
```

#### Option B: Log Level System
```javascript
// server/config/logger.js
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';  // error, warn, info, debug

function log(level, message, data) {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  if (levels[level] <= levels[LOG_LEVEL]) {
    console.log(`[${level.toUpperCase()}]`, message, data);
  }
}
```

**Recommendation**: Option B (Log Level System) for more flexibility

**Benefits**:
- Reduces log noise in production
- Can enable debug logging on-demand for troubleshooting
- Granular control over what gets logged

**Effort**: Low (2-3 hours for log level system)
**Risk**: Very Low
**Priority**: Low (current logging is helpful even in production)

---

## Code Quality & Maintainability

### 4. Automated Testing

**Current State**: No automated tests

**Proposed Test Strategy**:

#### Unit Tests (Jest + React Testing Library)
```typescript
// src/utils/__tests__/api.test.ts
describe('JSON Parsing', () => {
  it('should remove trailing commas', () => {
    const input = '{"key": "value",}';
    const result = parseJSON(input);
    expect(result).toEqual({ key: "value" });
  });

  it('should handle nested objects with trailing commas', () => {
    // ...
  });
});
```

#### Integration Tests
- File upload flow (DOCX, PDF)
- API analysis endpoint
- Session save/load

#### E2E Tests (Playwright)
- Full teacher workflow: upload → analyze → export CSV
- Full student workflow: upload → get feedback
- Role-based access control

**Test Coverage Goals**:
- Unit tests: 80%+ for utilities (api.ts, fileProcessing.ts, storage.ts)
- Integration tests: Critical paths only
- E2E tests: Happy path + major error scenarios

**Effort**: High (2-3 days for initial setup, ongoing maintenance)
**Risk**: Low (doesn't affect production, can be added incrementally)
**Priority**: Medium

---

### 5. Error Code System

**Current State**: Generic error messages in Icelandic

**Proposed Change**:
```typescript
// src/types/errors.ts
export const ERROR_CODES = {
  API_KEY_MISSING: 'ERR_001',
  FILE_TOO_LARGE: 'ERR_002',
  UNSUPPORTED_FORMAT: 'ERR_003',
  JSON_PARSE_FAILURE: 'ERR_004',
  API_TIMEOUT: 'ERR_005',
  STORAGE_UNAVAILABLE: 'ERR_006',
  // ... more codes
} as const;

export class AppError extends Error {
  constructor(
    public code: string,
    public userMessage: string,  // Icelandic
    public technicalDetails?: any
  ) {
    super(userMessage);
  }
}

// Usage:
throw new AppError(
  ERROR_CODES.JSON_PARSE_FAILURE,
  'Gat ekki túlkað svar frá AI',
  { jsonText, parseError }
);
```

**Benefits**:
- Easier troubleshooting (search logs by error code)
- Consistent error handling across codebase
- Better error documentation
- Can link error codes to help docs

**Effort**: Medium (4-6 hours to implement, test, and document)
**Risk**: Low
**Priority**: Low

---

### 6. Code Style & Linting

**Current State**: ESLint configured, but some rules are warnings

**Proposed Improvements**:

1. **Stricter TypeScript**:
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strictNullChecks": true,
       "noImplicitAny": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true
     }
   }
   ```

2. **Prettier Integration**:
   ```bash
   npm install --save-dev prettier eslint-config-prettier
   ```

3. **Pre-commit Hooks** (Husky + lint-staged):
   ```bash
   npm install --save-dev husky lint-staged
   ```

   ```json
   // package.json
   {
     "lint-staged": {
       "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
       "*.md": ["prettier --write"]
     }
   }
   ```

**Benefits**:
- Consistent code style
- Catch issues before commit
- Reduce PR review time

**Effort**: Low (2 hours setup)
**Risk**: Very Low
**Priority**: Medium

---

## Performance Optimizations

### 7. Token Usage Monitoring

**Current State**: Token usage logged per request but not tracked over time

**Proposed Addition**:
```javascript
// server/utils/metrics.js
const tokenUsageLog = [];

function recordTokenUsage(mode, inputTokens, outputTokens) {
  tokenUsageLog.push({
    timestamp: new Date(),
    mode,
    inputTokens,
    outputTokens,
    totalCost: calculateCost(inputTokens, outputTokens)
  });

  // Optional: Persist to file or database
  if (tokenUsageLog.length > 1000) {
    saveToFile('/var/log/kvenno/token-usage.json', tokenUsageLog);
    tokenUsageLog.length = 0;
  }
}
```

**Metrics to Track**:
- Average tokens per mode (teacher vs student)
- Peak usage times
- Cost per day/week/month
- Longest responses (potential optimization targets)

**Visualization**:
- Simple dashboard or CSV export
- Grafana integration (if monitoring stack exists)

**Benefits**:
- Budget forecasting
- Identify optimization opportunities
- Detect anomalies (e.g., sudden spike in usage)

**Effort**: Medium (4-6 hours for logging, more for visualization)
**Risk**: Very Low
**Priority**: Medium

---

### 8. Response Caching (Optional)

**Current State**: Every upload triggers a new API call

**Proposed Change**:
```typescript
// Cache responses based on file hash + experiment config
const cacheKey = `${fileHash}-${experimentId}-${mode}`;

if (cache.has(cacheKey) && !forceRefresh) {
  return cache.get(cacheKey);
}

const result = await analyzeReport(...);
cache.set(cacheKey, result, TTL_1_HOUR);
```

**Considerations**:
- Cache invalidation strategy
- Storage backend (Redis, in-memory, filesystem)
- Privacy implications (student reports should not be cached long-term)

**Benefits**:
- Reduced API costs for duplicate uploads
- Faster response for re-uploads
- Reduced load on Anthropic API

**Drawbacks**:
- Adds complexity
- May give stale results if prompts change
- Privacy concerns with caching student work

**Effort**: High (8+ hours to implement safely)
**Risk**: Medium (cache invalidation is hard)
**Priority**: Low (current costs are manageable)

---

### 9. Batch Processing Optimization

**Current State**: Sequential API calls for multiple files

**Proposed Change**:
```typescript
// Process files in parallel batches
async function analyzeMultipleReports(files, batchSize = 3) {
  const results = [];

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(file => analyzeReport(file))
    );
    results.push(...batchResults);
  }

  return results;
}
```

**Benefits**:
- Faster processing for bulk uploads
- Better resource utilization

**Considerations**:
- Anthropic API rate limits
- Server memory usage
- Timeout management

**Effort**: Low (2-3 hours)
**Risk**: Medium (need to handle rate limiting)
**Priority**: Low (current sequential approach is reliable)

---

## User Experience Enhancements

### 10. Progress Indicators

**Current State**: Basic loading state during upload

**Proposed Enhancements**:

1. **Upload Progress Bar**:
   ```typescript
   <ProgressBar
     current={uploadedFiles}
     total={totalFiles}
     label="Hleð upp skrám..."
   />
   ```

2. **Analysis Progress**:
   ```typescript
   <AnalysisProgress
     current={analyzedFiles}
     total={totalFiles}
     currentFile="report_1.docx"
     estimatedTimeRemaining="~2 mínútur"
   />
   ```

3. **Detailed Status Messages**:
   - "Umbreytir DOCX í PDF..." (Converting DOCX to PDF...)
   - "Vinnur úr texta..." (Processing text...)
   - "Greinir tilraunarskýrslu..." (Analyzing report...)

**Benefits**:
- Reduces perceived wait time
- User knows system is working
- Can identify stuck uploads

**Effort**: Medium (4-6 hours)
**Risk**: Low
**Priority**: Medium

---

### 11. Keyboard Shortcuts

**Current State**: Mouse-only interaction

**Proposed Shortcuts**:
- `Ctrl+S`: Save session
- `Ctrl+E`: Export results (teacher mode)
- `Ctrl+N`: New analysis
- `Esc`: Close modals
- `Ctrl+/`: Show keyboard shortcuts help

**Implementation**:
```typescript
// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handlers.save?.();
      }
      // ... more shortcuts
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
```

**Benefits**:
- Faster workflow for power users (teachers)
- Accessibility improvement
- Professional feel

**Effort**: Low (3-4 hours)
**Risk**: Very Low
**Priority**: Low

---

## Developer Experience

### 12. Development Mode Enhancements

**Current State**: Basic local development setup

**Proposed Additions**:

1. **Mock API Mode**:
   ```typescript
   // When VITE_USE_MOCK_API=true
   // Return pre-generated responses instead of calling Claude API
   // Useful for frontend development without API costs
   ```

2. **Sample Reports Repository**:
   ```
   /test-reports/
   ├── good_report.docx
   ├── medium_report.docx
   ├── poor_report.docx
   └── edge_cases/
       ├── very_long_report.pdf
       ├── multi_dot_filename.25.docx
       └── special_chars_íslenska.docx
   ```

3. **Development Dashboard**:
   - Shows current token usage
   - Quick access to debug mode
   - Sample file uploads
   - API response inspector

**Benefits**:
- Faster development iteration
- Easier onboarding for new developers
- Reduced API costs during development

**Effort**: Medium (6-8 hours for full implementation)
**Risk**: Low
**Priority**: Low

---

### 13. API Documentation

**Current State**: No formal API documentation

**Proposed Documentation**:

#### OpenAPI/Swagger Spec
```yaml
# server/openapi.yaml
openapi: 3.0.0
info:
  title: LabReports API
  version: 3.2.0
paths:
  /api/analyze:
    post:
      summary: Analyze lab report
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                content: ...
                systemPrompt: ...
                mode: ...
      responses:
        200:
          description: Analysis complete
          content:
            application/json:
              schema:
                ...
```

#### Interactive Documentation
- Use Swagger UI or Redoc
- Host at `/api/docs` in development
- Include example requests and responses

**Benefits**:
- Easier for future developers
- Can generate client libraries
- Self-documenting API

**Effort**: Medium (4-6 hours)
**Risk**: Very Low
**Priority**: Low

---

## Infrastructure & Monitoring

### 14. Health Check Endpoint Improvements

**Current State**: Basic `/health` endpoint

**Proposed Enhancement**:
```javascript
// /api/health
{
  "status": "ok",
  "timestamp": "2025-11-28T12:00:00Z",
  "version": "3.2.0",
  "checks": {
    "database": "ok",  // if database added
    "anthropic_api": "ok",
    "pandoc": "ok",
    "disk_space": "ok",
    "memory": "ok"
  },
  "uptime": "5d 3h 22m",
  "requests_processed": 1234
}
```

**Benefits**:
- Better monitoring integration
- Proactive issue detection
- Debugging assistance

**Effort**: Low (2-3 hours)
**Risk**: Very Low
**Priority**: Medium

---

### 15. Alerting System

**Current State**: No automated alerting

**Proposed Alerts**:

1. **Token Usage Alert**:
   - Trigger: Daily usage > 90% of budget
   - Action: Email notification

2. **Error Rate Alert**:
   - Trigger: Error rate > 5% over 10 minutes
   - Action: Slack/email notification

3. **API Timeout Alert**:
   - Trigger: 3+ timeouts in 5 minutes
   - Action: Check if Anthropic API is slow

4. **Disk Space Alert**:
   - Trigger: < 1GB free space
   - Action: Email sysadmin

**Implementation Options**:
- Simple: Cron job + email
- Advanced: Prometheus + Alertmanager
- Cloud: AWS CloudWatch, Datadog

**Effort**: Medium (varies by complexity)
**Risk**: Low
**Priority**: Medium

---

## Future Features

### 16. Multi-Language Support

**Current State**: Icelandic only

**Proposed Change**:
- Add i18n library (e.g., `react-i18next`)
- Extract all UI strings to translation files
- Support English, Icelandic (and potentially Danish, Norwegian)

**Considerations**:
- Claude prompts would need to be translated
- Different feedback tone for different cultures
- Test with native speakers

**Effort**: High (2-3 weeks)
**Risk**: Medium
**Priority**: Low (current users are all Icelandic)

---

### 17. Report Templates

**Current State**: Students write reports from scratch

**Proposed Feature**:
- Downloadable report template (.docx)
- Pre-filled section headers
- Example content and formatting
- Experiment-specific templates

**Benefits**:
- Helps students structure reports correctly
- Reduces "section missing" issues
- Improves overall report quality

**Effort**: Low (2-3 hours per template)
**Risk**: Very Low
**Priority**: Medium

---

### 18. Feedback History & Comparison

**Current State**: Each upload is independent

**Proposed Feature**:
```typescript
interface ReportHistory {
  studentId: string;  // or anonymous hash
  reportId: string;
  versions: Array<{
    timestamp: Date;
    score: number;
    feedback: Feedback;
  }>;
}
```

**Features**:
- Track improvement over time
- Compare multiple submissions of same report
- Show progress charts
- Highlight areas of improvement

**Considerations**:
- Requires user accounts (Azure AD integration)
- Privacy implications (GDPR compliance)
- Data retention policies

**Effort**: High (requires authentication system, database)
**Risk**: High (privacy, security)
**Priority**: Low (future consideration)

---

## Prioritization Matrix

| Improvement | Effort | Risk | Priority | Impact |
|-------------|--------|------|----------|--------|
| Token limit env var | Low | Very Low | Medium | Medium |
| JSON repair library | Low | Low | Medium | High |
| Debug logging config | Low | Very Low | Low | Low |
| Automated testing | High | Low | Medium | High |
| Error code system | Medium | Low | Low | Medium |
| Token usage monitoring | Medium | Very Low | Medium | Medium |
| Progress indicators | Medium | Low | Medium | High |
| Health check improvements | Low | Very Low | Medium | Medium |
| Report templates | Low | Very Low | Medium | High |
| Alerting system | Medium | Low | Medium | High |

**Recommended Next Steps** (in order):
1. Token limit environment variable (quick win)
2. JSON repair library (improves reliability)
3. Progress indicators (improves UX)
4. Report templates (helps students)
5. Token usage monitoring (cost control)

---

## Implementation Guidelines

### Before Starting Any Improvement

1. **Create a new branch**: `git checkout -b feature/improvement-name`
2. **Document the current behavior**: Screenshots, test cases
3. **Write tests first** (if adding testing)
4. **Implement incrementally**: Small, testable changes
5. **Test thoroughly**: Unit, integration, manual testing
6. **Update documentation**: CLAUDE.md, README.md, etc.
7. **Create pull request**: With detailed description
8. **Deploy to staging first**: Test in production-like environment

### Rollback Plan

Every improvement should have a rollback strategy:
- Feature flags for new functionality
- Database migrations should be reversible
- Keep old code commented out for easy revert
- Document rollback procedure in PR

---

## Rejected Ideas

### Ideas Considered But Not Recommended

1. **Real-time collaboration** - Complexity too high for current needs
2. **Mobile app** - Web app with responsive design is sufficient
3. **Video feedback** - Text feedback is more practical for teachers
4. **AI-powered report writing** - Goes against educational goals (students should write)
5. **Blockchain for grades** - Overkill for this use case

---

## Contributing

If you want to work on any of these improvements:

1. Check if someone is already working on it (GitHub issues)
2. Create an issue describing your approach
3. Get feedback before starting implementation
4. Follow the implementation guidelines above
5. Submit a pull request when ready

---

## Version Planning

### v3.3.0 (Proposed - Q1 2026)
- Token limit environment variable
- JSON repair library
- Progress indicators
- Report templates

### v3.4.0 (Proposed - Q2 2026)
- Automated testing framework
- Token usage monitoring
- Alerting system

### v4.0.0 (Proposed - Q3 2026)
- Azure AD authentication (see `/docs/guides/AZURE-AD-GUIDE.md`)
- User profiles
- Report history tracking

---

**Last Updated**: 2025-11-28
**Status**: Planning Document
**Next Review**: 2026-01-31
