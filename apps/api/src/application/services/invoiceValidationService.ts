import { ExtractedInvoiceData } from "../../domain/entities/documentExtraction.js";

export function validateExtractedInvoiceData(
  data: ExtractedInvoiceData,
): string[] {
  const errors: string[] = [];

  if (!data.supplierName) {
    errors.push("Supplier name is required");
  }

  if (!data.invoiceNumber) {
    errors.push("Invoice number is required");
  }

  if (!data.invoiceDate) {
    errors.push("Invoice date is required");
  } else if (Number.isNaN(Date.parse(data.invoiceDate))) {
    errors.push("Invoice date must be a valid date");
  }

  if (!data.currency) {
    errors.push("Currency is required");
  } else if (!/^[A-Z]{3}$/.test(data.currency)) {
    errors.push("Currency must be a 3-letter ISO code");
  }

  if (!data.grossAmount) {
    errors.push("Gross amount is required");
  } else {
    const amount = Number(data.grossAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      errors.push("Gross amount must be a positive number");
    }
  }

  return errors;
}
