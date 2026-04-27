import { Invoice } from "../../domain/entities/invoice.js";
import { InvoiceStatus } from "../../domain/enums/invoiceStatus.js";

export interface IInvoiceRepository {
  createDraft(params: {
    tenantId: string;
    documentId: string;
    invoiceNumber: string;
    supplierName: string;
    invoiceDate: Date;
    currency: string;
    grossAmount: string;
  }): Promise<Invoice>;

  findByIdForTenant(params: {
    tenantId: string;
    invoiceId: string;
  }): Promise<Invoice | null>;

  listForTenant(params: { tenantId: string }): Promise<Invoice[]>;

  updateStatus(params: {
    tenantId: string;
    invoiceId: string;
    status: InvoiceStatus;
  }): Promise<Invoice>;
}
