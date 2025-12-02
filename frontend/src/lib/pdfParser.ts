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

function isLikelyDate(numStr: string): boolean {
  const num = numStr.replace(/,/g, '');
  if (num.length === 8 && /^\d{8}$/.test(num)) {
    const day = parseInt(num.substring(0, 2));
    const month = parseInt(num.substring(2, 4));
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) return true;
  }
  if (num.length > 10) return true;
  return false;
}

function extractCurrencyValues(text: string): number[] {
  const values: number[] = [];
  const patterns = [
    /₹\s*([\d,]+(?:\.\d{1,2})?)/g,
    /Rs\.?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /INR\s*([\d,]+(?:\.\d{1,2})?)/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const numStr = match[1].replace(/,/g, '');
      if (!isLikelyDate(numStr)) {
        const value = parseFloat(numStr);
        if (value > 0 && value < 100000000000) {
          values.push(value);
        }
      }
    }
  }
  return values;
}

function parseCASText(text: string): ParsedCASData {
  const funds: ExtractedFund[] = [];
  let totalValue = 0;
  let totalInvested = 0;

  log.debug('Starting CAS text parsing');
  log.debug('Text length:', text.length);
  log.debug('First 2000 chars:', text.substring(0, 2000));

  const fullText = text.replace(/\s+/g, ' ');
  
  const summaryPatterns = [
    /Total\s+Value[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /Grand\s+Total[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /Market\s+Value[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /Current\s+Value[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /Valuation[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
  ];

  const costPatterns = [
    /Cost\s+Value[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /Total\s+Cost[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /Investment\s+Value[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
    /Amount\s+Invested[:\s]*₹?\s*([\d,]+(?:\.\d{1,2})?)/gi,
  ];

  for (const pattern of summaryPatterns) {
    let match;
    while ((match = pattern.exec(fullText)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (value > 1000 && value < 100000000000 && !isLikelyDate(match[1])) {
        log.debug('Found potential total value:', { pattern: pattern.source, value });
        if (value > totalValue) totalValue = value;
      }
    }
  }

  for (const pattern of costPatterns) {
    let match;
    while ((match = pattern.exec(fullText)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (value > 1000 && value < 100000000000 && !isLikelyDate(match[1])) {
        log.debug('Found potential cost value:', { pattern: pattern.source, value });
        if (value > totalInvested) totalInvested = value;
      }
    }
  }

  const fundPatterns = [
    /([A-Za-z][A-Za-z\s\-&()\.]+(?:Fund|Plan|Growth|Dividend))\s+(?:ISIN[:\s]*)?([A-Z0-9]{12})?\s*(?:.*?)(Direct|Regular)/gi,
    /([A-Za-z][A-Za-z\s\-&()\.0-9]+)\s+(Growth|Dividend)\s*-?\s*(Direct|Regular)/gi,
  ];

  const lines = text.split(/[\n\r]+/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.length < 10) continue;

    const hasFundIndicator = /Growth|Dividend|ISIN|Direct Plan|Regular Plan/i.test(line);
    const hasPlanType = /\b(Direct|Regular)\b/i.test(line);
    
    if (hasFundIndicator && hasPlanType) {
      let name = 'Unknown Fund';
      const nameMatch = line.match(/^([A-Za-z][A-Za-z\s\-&()\.0-9]{5,60}?)(?:\s+ISIN|\s+Growth|\s+Dividend|\s+Direct|\s+Regular)/i);
      if (nameMatch) {
        name = nameMatch[1].trim().replace(/\s+/g, ' ');
      }

      const planMatch = line.match(/\b(Direct|Regular)\b/i);
      const planType = planMatch ? planMatch[1] : 'Regular';

      const currencyValues = extractCurrencyValues(line);
      
      const contextLines = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join(' ');
      const contextValues = extractCurrencyValues(contextLines);

      const validValues = (currencyValues.length >= 2 ? currencyValues : contextValues)
        .filter(v => v > 100 && v < 10000000000 && !isLikelyDate(v.toString()));

      log.debug('Fund candidate:', { 
        name, 
        planType, 
        valuesFound: validValues.length,
        values: validValues.slice(0, 5),
        line: line.substring(0, 80)
      });

      if (validValues.length >= 2 && name !== 'Unknown Fund') {
        let invested = validValues[0];
        let current = validValues[validValues.length - 1];

        if (validValues.length === 2) {
          invested = validValues[0];
          current = validValues[1];
        } else if (validValues.length > 2) {
          invested = validValues[validValues.length - 2];
          current = validValues[validValues.length - 1];
        }

        const ratio = invested > 0 ? current / invested : 1;
        if (ratio > 0.01 && ratio < 100) {
          const folioMatch = lines.slice(Math.max(0, i - 5), i)
            .reverse()
            .find(l => l.match(/Folio[:\s]*([A-Z0-9\/\-]+)/i));
          const folio = folioMatch 
            ? (folioMatch.match(/Folio[:\s]*([A-Z0-9\/\-]+)/i)?.[1] || 'N/A')
            : 'N/A';

          const amcMatch = name.match(/(ICICI|HDFC|Axis|SBI|Motilal|Franklin|Kotak|DSP|L&T|Aditya|Nippon|JM|IDFC|Canara|LIC|UTI|Tata|Mahindra|Quantum|Invesco|PGIM|Mirae|Parag Parikh|PPFAS|Edelweiss|Sundaram)/i);
          const amc = amcMatch ? amcMatch[1] : 'Unknown';

          const existingFund = funds.find(f => 
            f.name.toLowerCase().includes(name.toLowerCase().substring(0, 20)) ||
            name.toLowerCase().includes(f.name.toLowerCase().substring(0, 20))
          );

          if (!existingFund) {
            log.debug('Adding fund:', { name, invested, current, planType, amc, ratio });
            funds.push({
              name,
              folio,
              value: current,
              invested: invested,
              planType,
              amc,
            });
          }
        }
      }
    }
  }

  if (funds.length > 0) {
    const calculatedValue = funds.reduce((sum, f) => sum + f.value, 0);
    const calculatedInvested = funds.reduce((sum, f) => sum + f.invested, 0);
    
    if (totalValue === 0 || Math.abs(totalValue - calculatedValue) / calculatedValue > 0.5) {
      totalValue = calculatedValue;
    }
    if (totalInvested === 0 || Math.abs(totalInvested - calculatedInvested) / calculatedInvested > 0.5) {
      totalInvested = calculatedInvested;
    }
  }

  log.debug('Final parsed data:', { 
    fundsCount: funds.length, 
    totalValue, 
    totalInvested,
    funds: funds.map(f => ({ name: f.name.substring(0, 30), value: f.value, invested: f.invested }))
  });
  
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
