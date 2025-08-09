/**
 * Debug script to examine PDF text structure
 */

import pdfParse from 'pdf-parse';
import { promises as fs } from 'fs';

async function debugPDF(filePath: string) {
  try {
    const buffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(buffer);
    
    console.log(`\n=== DEBUG: ${filePath} ===`);
    console.log('First 2000 characters of extracted text:');
    console.log(pdfData.text.substring(0, 2000));
    console.log('\n=== Lines containing potential names ===');
    
    const lines = pdfData.text.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.includes('Amyn') || trimmed.includes('Porbanderwala') || trimmed.includes('AMYN') || trimmed.includes('PORBANDERWALA')) {
        console.log(`Line ${index + 1}: "${trimmed}"`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Debug both files
const testFiles = [
  '/Users/amynporb/Documents/projects/personal-coach/resources/Porbanderwala-Amyn-SF_TOP_5.pdf',
  '/Users/amynporb/Documents/projects/personal-coach/resources/Porbanderwala-Amyn-ALL_34.pdf'
];

Promise.all(testFiles.map(debugPDF))
  .then(() => console.log('\nDebug complete'))
  .catch(console.error);