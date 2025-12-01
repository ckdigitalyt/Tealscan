import * as pdfjsLib from 'pdfjs-dist';

// Use a specific CDN version that matches pdfjs-dist v4.4.168
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

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
    
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: password,
    });
    
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
    if (error?.name === 'PasswordException') {
      throw new Error('Incorrect password. Please check and try again.');
    } else if (error?.name === 'InvalidPDFException') {
      throw new Error('Invalid PDF file. Please upload a valid CAS PDF.');
    } else if (error?.message?.includes('worker')) {
      throw new Error('PDF processing failed. Please refresh and try again.');
    }
    
    throw new Error(`Failed to extract PDF text: ${error?.message || 'Unknown error'}`);
  }
}

function parseCASText(text: string): ParsedCASData {
  const funds: ExtractedFund[] = [];
  let totalValue = 0;
  let totalInvested = 0;

  // Regex patterns for CAS format
  const fundPattern = /([A-Za-z\s\-&()]+?)\s+(?:ISIN:|Growth|Dividend)\s+([A-Z0-9]{12})?[\s\S]*?(?:Plan:|Direct|Regular)\s+(Direct|Regular)[\s\S]*?₹\s+([\d,]+\.?\d*)\s+₹\s+([\d,]+\.?\d*)/gi;
  
  const folio_pattern = /Folio\s+([A-Z0-9\s/\-]+?)\s+(?=Folio|Account|Statement|$)/i;
  const amc_pattern = /(ICICI|HDFC|Axis|SBI|Motilal|Franklin|Kotak|DSP|L&T|Aditya Birla|Nippon|JM Financial|IDFC|Canara|HDFC Life|LIC)/i;

  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Try to match fund entry
    if (line.match(/ISIN:|Growth|Dividend/) && line.match(/Direct|Regular/)) {
      try {
        // Extract fund name
        const nameMatch = line.match(/^([A-Za-z\s\-&()]+?)\s+(?:ISIN:|Growth|Dividend)/);
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown Fund';

        // Extract plan type
        const planMatch = line.match(/(Direct|Regular)/);
        const planType = planMatch ? planMatch[1] : 'Regular';

        // Extract current value and invested amount
        const valueMatch = line.match(/₹\s+([\d,]+\.?\d*)/g);
        if (valueMatch && valueMatch.length >= 2) {
          const currentValue = parseFloat(valueMatch[valueMatch.length - 1].replace(/₹\s+/, '').replace(/,/g, ''));
          const investedAmount = parseFloat(valueMatch[0].replace(/₹\s+/, '').replace(/,/g, ''));

          // Extract folio
          const folioMatch = lines.slice(Math.max(0, i - 5), i).reverse().find(l => l.match(/[A-Z0-9\/\-]{10,}/));
          const folio = folioMatch ? folioMatch.trim().substring(0, 20) : 'N/A';

          // Guess AMC from fund name
          const amcMatch = name.match(/(ICICI|HDFC|Axis|SBI|Motilal|Franklin|Kotak|DSP|L&T|Aditya|Nippon|JM|IDFC|Canara|LIC)/i);
          const amc = amcMatch ? amcMatch[1] : 'Unknown';

          if (currentValue > 0) {
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
        }
      } catch (e) {
        // Continue parsing
      }
    }
  }

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
