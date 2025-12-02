import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to match the installed pdfjs-dist version (4.10.38)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

// Detailed logging helper
const log = {
  info: (msg: string, data?: any) => {
    console.log(`[PDF-PARSER] INFO: ${msg}`, data !== undefined ? data : '');
  },
  error: (msg: string, error?: any) => {
    console.error(`[PDF-PARSER] ERROR: ${msg}`, error !== undefined ? error : '');
    if (error?.stack) console.error(`[PDF-PARSER] Stack:`, error.stack);
  },
  debug: (msg: string, data?: any) => {
    console.log(`[PDF-PARSER] DEBUG: ${msg}`, data !== undefined ? data : '');
  },
  warn: (msg: string, data?: any) => {
    console.warn(`[PDF-PARSER] WARN: ${msg}`, data !== undefined ? data : '');
  }
};

export interface ExtractedFund {
  name: string;
  folio: string;
  value: number;
  invested: number;
  planType: string;
  amc: string;
}

export interface ParsedCASData {
  funds: ExtractedFund[];
  totalValue: number;
  totalInvested: number;
}

async function extractTextFromPDF(file: File, password: string): Promise<string> {
  log.info('Starting PDF text extraction', { fileName: file.name, fileSize: file.size, fileType: file.type });
  
  try {
    log.debug('Converting file to ArrayBuffer...');
    const arrayBuffer = await file.arrayBuffer();
    log.debug('ArrayBuffer created', { byteLength: arrayBuffer.byteLength });
    
    log.debug('PDF.js worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    log.info('Loading PDF document with password...');
    
    // PDF.js can accept password as string or Uint8Array
    // Try with string first, then handle password callback for encrypted PDFs
    const passwordStr = password || '';
    log.debug('Preparing password for PDF.js', { hasPassword: passwordStr.length > 0 });
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: passwordStr,
    });
    
    // Handle password-protected PDF - set callback to provide password if needed
    let passwordAttempted = false;
    loadingTask.onPassword = (updatePassword: Function, reason: number) => {
      log.debug('PDF password callback triggered', { reason, passwordAttempted });
      // Reason: 1 = user password, 2 = owner password
      if (!passwordAttempted && passwordStr) {
        passwordAttempted = true;
        try {
          // Try updating with the provided password
          updatePassword(passwordStr);
        } catch (err) {
          log.error('Error calling updatePassword', err);
        }
      }
    };
    
    log.debug('PDF loading task created, awaiting promise...');
    const pdf = await loadingTask.promise;
    log.info('PDF loaded successfully', { numPages: pdf.numPages });

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      log.debug(`Extracting text from page ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
      log.debug(`Page ${i} extracted`, { textLength: pageText.length });
    }

    log.info('PDF text extraction complete', { totalTextLength: fullText.length });
    return fullText;
  } catch (error: any) {
    log.error('PDF extraction failed', error);
    log.error('Error details', { 
      name: error?.name, 
      message: error?.message,
      code: error?.code
    });
    
    // More specific error messages based on PDF.js error types
    if (error?.name === 'PasswordException' || error?.message?.toLowerCase().includes('password')) {
      throw new Error('Incorrect password. Please check and try again.');
    } else if (error?.name === 'InvalidPDFException' || error?.message?.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please upload a valid CAS PDF.');
    } else if (error?.message?.includes('worker')) {
      throw new Error('PDF processing failed. Please refresh and try again.');
    } else if (error?.message?.includes('encrypted') || error?.message?.includes('Encrypted')) {
      throw new Error('Incorrect password. Please check and try again.');
    }
    
    throw new Error(`Failed to extract PDF text: ${error?.message || 'Unknown error'}`);
  }
}

function parseCASText(text: string): ParsedCASData {
  const funds: ExtractedFund[] = [];
  let totalValue = 0;
  let totalInvested = 0;

  // Normalize text: handle different rupee symbols
  let normalizedText = text
    .replace(/₹/g, '₹')  // Standard rupee symbol
    .replace(/Rs\./g, '₹')  // Rs. format
    .replace(/Rs\s+/g, '₹');  // Rs format

  log.debug('Normalized text length:', normalizedText.length);
  log.debug('First 500 chars of text:', normalizedText.substring(0, 500));

  const lines = normalizedText.split('\n');
  log.debug('Total lines:', lines.length);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;

    // Look for fund entries - more flexible pattern matching
    // Look for lines with fund characteristics
    const hasISIN = line.match(/ISIN[:\s]+[A-Z0-9]{12}/i);
    const hasGrowthDiv = line.match(/Growth|Dividend|Gross|Net|Value/i);
    const hasPlan = line.match(/Direct|Regular|Growth|Dividend/i);
    const hasValue = line.match(/[\d,]+\.?\d+/);

    if ((hasISIN || hasGrowthDiv) && hasPlan && hasValue) {
      try {
        // Extract fund name (everything before ISIN or Growth/Dividend)
        const nameMatch = line.match(/^([A-Za-z\s\-&()0-9]+?)(?:\s+ISIN|\s+Growth|\s+Dividend|$)/i);
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown Fund';

        // Extract plan type
        const planMatch = line.match(/(Direct|Regular)/i);
        const planType = planMatch ? planMatch[1] : 'Regular';

        // Extract values - handle both ₹ and numeric values
        const allValues = line.match(/[\d,]+\.?\d+/g);
        if (allValues && allValues.length >= 2) {
          try {
            const currentValue = parseFloat(allValues[allValues.length - 1].replace(/,/g, ''));
            const investedAmount = parseFloat(allValues[0].replace(/,/g, ''));

            // Extract folio
            const folioMatch = lines.slice(Math.max(0, i - 5), i).reverse().find(l => l.match(/[A-Z0-9]{4,}[\/\-]?[A-Z0-9]*/));
            const folio = folioMatch ? folioMatch.trim().substring(0, 25) : 'N/A';

            // Guess AMC from fund name
            const amcMatch = name.match(/(ICICI|HDFC|Axis|SBI|Motilal|Franklin|Kotak|DSP|L&T|Aditya|Nippon|JM|IDFC|Canara|LIC|UTI|Tata|Mahindra|Quantum|Invesco|PGIM)/i);
            const amc = amcMatch ? amcMatch[1] : 'Unknown';

            if (currentValue > 0 || investedAmount > 0) {
              log.debug('Found fund:', { name, currentValue, investedAmount, planType, amc });
              funds.push({
                name,
                folio,
                value: currentValue,
                invested: investedAmount,
                planType,
                amc,
              });

              totalValue += currentValue;
              totalInvested += investedAmount;
            }
          } catch (parseErr) {
            log.debug('Error parsing values:', parseErr);
          }
        }
      } catch (e) {
        log.debug('Error processing fund line:', e);
      }
    }
  }

  log.debug('Parsed funds count:', funds.length);
  return {
    funds,
    totalValue,
    totalInvested,
  };
}

export async function parseCASFile(file: File, password: string): Promise<ParsedCASData> {
  log.info('=== Starting CAS file parsing ===');
  log.info('File details', { name: file.name, size: file.size, type: file.type });
  const startTime = performance.now();

  try {
    log.info('Step 1: Extracting text from PDF...');
    const text = await extractTextFromPDF(file, password);
    log.info('Step 1 complete: Text extracted', { textLength: text.length });
    
    log.info('Step 2: Parsing CAS text for funds...');
    const data = parseCASText(text);
    log.info('Step 2 complete: Text parsed', { 
      fundsCount: data.funds.length, 
      totalValue: data.totalValue,
      totalInvested: data.totalInvested 
    });

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(0);
    log.info(`=== Parsing complete in ${duration}ms ===`);
    log.info('Results', { 
      funds: data.funds.length, 
      totalValue: `₹${data.totalValue.toLocaleString('en-IN')}` 
    });

    if (data.funds.length === 0) {
      log.warn('No funds found in parsed data');
      log.debug('First 1000 chars of extracted text:', text.substring(0, 1000));
      throw new Error('No funds found in CAS. Please check the file format and password.');
    }

    return data;
  } catch (error: any) {
    const endTime = performance.now();
    log.error(`=== Parsing failed after ${(endTime - startTime).toFixed(0)}ms ===`);
    log.error('Error in parseCASFile', error);
    log.error('Error type', { 
      name: error?.name, 
      message: error?.message,
      isError: error instanceof Error 
    });
    
    // Re-throw with proper error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to parse CAS PDF. Please try again.');
  }
}
