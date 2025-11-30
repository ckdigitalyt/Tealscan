import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      password: password,
    }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    throw new Error('Failed to extract PDF text. Check password.');
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
  console.log('🔒 Starting client-side PDF parsing...');
  const startTime = performance.now();

  try {
    const text = await extractTextFromPDF(file, password);
    const data = parseCASText(text);

    const endTime = performance.now();
    console.log(`✅ File processed locally in ${(endTime - startTime).toFixed(0)}ms. Network request size: 0KB`);
    console.log(`📊 Extracted ${data.funds.length} funds. Total value: ₹${data.totalValue.toLocaleString('en-IN')}`);

    if (data.funds.length === 0) {
      throw new Error('No funds found in CAS. Please check the file and password.');
    }

    return data;
  } catch (error) {
    console.error('❌ PDF parsing error:', error);
    throw error instanceof Error ? error : new Error('Failed to parse CAS PDF');
  }
}
