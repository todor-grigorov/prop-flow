import { InvoiceStatus } from "../enums/invoiceStatus.js";

export type Invoice = {
  id: string;
  tenantId: string;
  documentId: string | null;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: Date;
  currency: string;
  grossAmount: string;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
};
