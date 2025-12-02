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
  const lines = text.split(/[\n\r]+/);
  
  const fundsByName: { [key: string]: ExtractedFund } = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Look for fund header lines: contains fund code + fund name + Direct/Growth/Dividend/Regular
    // Example: "LCDGG - Canara Robeco Large Cap Fund   -   Direct Growth"
    const fundHeaderMatch = line.match(/^([A-Z0-9]{5,8})\s*-\s*([A-Za-z\s\-&()]+?)\s*-\s*(Direct|Regular|Growth|Dividend|DIRECT|INDIRECT)/i);
    
    if (fundHeaderMatch) {
      const fundCode = fundHeaderMatch[1];
      const fundName = fundHeaderMatch[2].trim().replace(/\s+/g, ' ');
      
      log.debug('Found fund header:', { fundCode, fundName, line: line.substring(0, 100) });

      // Look for ISIN and other details on next lines
      let planType = 'Regular';
      let folio = 'N/A';
      let isin = '';
      let amc = 'Unknown';

      // Search ahead for more details
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const detailLine = lines[j].trim();
        
        // Look for plan type
        if (/Direct|Regular|DIRECT|REGULAR/i.test(detailLine)) {
          const planMatch = detailLine.match(/(Direct|Regular|DIRECT|REGULAR)/i);
          if (planMatch) planType = planMatch[1].charAt(0).toUpperCase() + planMatch[1].slice(1).toLowerCase();
        }
        
        // Look for folio
        const folioMatch = detailLine.match(/Folio\s+(?:No)?[:\s]*([A-Z0-9\/\-]+)/i);
        if (folioMatch) folio = folioMatch[1].trim().substring(0, 25);
        
        // Look for ISIN
        const isinMatch = detailLine.match(/ISIN[:\s]*([A-Z0-9\s]+)/i);
        if (isinMatch) isin = isinMatch[1].trim().substring(0, 15);
        
        // Break if we hit next fund or transaction section
        if (/^[A-Z0-9]{5,8}\s*-/i.test(detailLine) || detailLine.match(/Date.*Amount.*Price/)) break;
      }

      // Extract AMC from fund name
      const amcMatch = fundName.match(/(ICICI|HDFC|Axis|SBI|Motilal|Franklin|Kotak|DSP|L&T|Aditya|Nippon|JM|IDFC|Canara|LIC|UTI|Tata|Mahindra|Quantum|Invesco|PGIM|Mirae|Parag Parikh|PPFAS|Edelweiss|Sundaram)/i);
      amc = amcMatch ? amcMatch[1] : 'Unknown';

      // Now search for Market Value and Cost Value for this fund
      let marketValue = 0;
      let costValue = 0;

      for (let j = i; j < Math.min(i + 50, lines.length); j++) {
        const valueLine = lines[j].trim();
        
        // Look for Market Value
        const mvMatch = valueLine.match(/Market\s+Value.*?INR\s+([\d,]+(?:\.\d{1,2})?)/i);
        if (mvMatch) {
          marketValue = parseFloat(mvMatch[1].replace(/,/g, ''));
          log.debug('Found market value:', { fundCode, marketValue });
        }
        
        // Look for Cost Value or Total Cost Value
        const cvMatch = valueLine.match(/(?:Total\s+)?Cost\s+Value.*?INR?\s*[:\s]*([\d,]+(?:\.\d{1,2})?)/i);
        if (cvMatch) {
          costValue = parseFloat(cvMatch[1].replace(/,/g, ''));
          log.debug('Found cost value:', { fundCode, costValue });
        }
        
        // Break if we hit next fund
        if (j > i && /^[A-Z0-9]{5,8}\s*-/i.test(valueLine)) break;
      }

      if (marketValue > 0 || costValue > 0) {
        if (costValue === 0) costValue = marketValue;
        if (marketValue === 0) marketValue = costValue;

        log.debug('Adding fund from header:', { fundCode, fundName, marketValue, costValue, planType });
        
        fundsByName[fundCode] = {
          name: fundName,
          folio,
          value: marketValue,
          invested: costValue,
          planType,
          amc,
        };
      }
    }
  }

  // Convert to array and sum totals
  for (const fundCode in fundsByName) {
    const fund = fundsByName[fundCode];
    if (fund.value > 0 || fund.invested > 0) {
      funds.push(fund);
      totalValue += fund.value;
      totalInvested += fund.invested;
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
