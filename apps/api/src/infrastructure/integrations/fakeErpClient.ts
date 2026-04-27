import { IErpClient } from "../../application/ports/IErpClient.js";
import { Invoice } from "../../domain/entities/invoice.js";

export class FakeErpClient implements IErpClient {
  async syncInvoice(invoice: Invoice): Promise<{
    externalId: string;
    syncedAt: string;
  }> {
    if (invoice.invoiceNumber.includes("FAIL")) {
      throw new Error("Fake ERP rejected invoice");
    }

    return {
      externalId: `ERP-${invoice.id}`,
      syncedAt: new Date().toISOString(),
    };
  }
}
