/**
 * Quick diagnostic script to check PDF extraction
 *
 * Paste this into browser console AFTER uploading a file to see detailed extraction info
 */

// Enable verbose logging
console.log('=== PDF EXTRACTION DIAGNOSTICS ===');

// This will show all the detailed logs when you upload a file
// Look for:
// 1. "tableColumnsDetected" - how many column separators per page
// 2. Text sample - does it have proper line breaks?
// 3. Are there unwanted " | " separators in normal text?

// To see raw text extraction, add this breakpoint:
// In DevTools > Sources > fileProcessing.ts > line 425 (return result)
// Then inspect result.data in console

// Check current debug mode status
console.log('Debug mode enabled:', localStorage.getItem('debug-extraction') === 'true');

// Quick test of threshold values
console.log('\nTo adjust table detection threshold:');
console.log('  - Current: 20 units');
console.log('  - Decrease (10-15): Detect more tables (may add false positives)');
console.log('  - Increase (30-50): Only detect wide-spaced tables (fewer false positives)');
