export type ExtractedInvoiceData = {
  supplierName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  currency?: string;
  grossAmount?: string;
};

export type DocumentExtraction = {
  id: string;
  documentId: string;
  extractedJson: ExtractedInvoiceData;
  confidenceJson: Record<string, number>;
  validationErrors: string[] | null;
  createdAt: Date;
};
