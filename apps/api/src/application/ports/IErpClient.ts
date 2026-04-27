import { Invoice } from "../../domain/entities/invoice.js";

export interface IErpClient {
  syncInvoice(invoice: Invoice): Promise<{
    externalId: string;
    syncedAt: string;
  }>;
}
