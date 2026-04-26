import { ExtractedInvoiceData } from "../../domain/entities/documentExtraction.js";

function extractLineValue(content: string, label: string): string | undefined {
  const regex = new RegExp(`^${label}:\\s*(.+)$`, "im");
  const match = content.match(regex);
  return match?.[1]?.trim();
}

export function extractInvoiceDataFromText(content: string): {
  extractedData: ExtractedInvoiceData;
  confidence: Record<string, number>;
} {
  const extractedData: ExtractedInvoiceData = {
    supplierName: extractLineValue(content, "Supplier"),
    invoiceNumber: extractLineValue(content, "Invoice Number"),
    invoiceDate: extractLineValue(content, "Invoice Date"),
    currency: extractLineValue(content, "Currency"),
    grossAmount: extractLineValue(content, "Gross Amount"),
  };

  const confidence: Record<string, number> = {};

  for (const [key, value] of Object.entries(extractedData)) {
    confidence[key] = value ? 0.95 : 0;
  }

  return {
    extractedData,
    confidence,
  };
}
