import { IInvoiceRepository } from "../../../application/ports/IInvoiceRepository.js";
import { Invoice } from "../../../domain/entities/invoice.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

function toDomainInvoice(invoice: {
  id: string;
  tenantId: string;
  documentId: string | null;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: Date;
  currency: string;
  grossAmount: { toString(): string };
  status: Invoice["status"];
  createdAt: Date;
  updatedAt: Date;
}): Invoice {
  return {
    ...invoice,
    grossAmount: invoice.grossAmount.toString(),
  };
}

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createDraft(params: {
    tenantId: string;
    documentId: string;
    invoiceNumber: string;
    supplierName: string;
    invoiceDate: Date;
    currency: string;
    grossAmount: string;
  }): Promise<Invoice> {
    const invoice = await this.prisma.invoice.create({
      data: {
        tenantId: params.tenantId,
        documentId: params.documentId,
        invoiceNumber: params.invoiceNumber,
        supplierName: params.supplierName,
        invoiceDate: params.invoiceDate,
        currency: params.currency,
        grossAmount: params.grossAmount,
        status: "DRAFT",
      },
    });

    return toDomainInvoice(invoice);
  }

  async findByIdForTenant(params: {
    tenantId: string;
    invoiceId: string;
  }): Promise<Invoice | null> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: params.invoiceId,
        tenantId: params.tenantId,
      },
    });

    return invoice ? toDomainInvoice(invoice) : null;
  }

  async listForTenant(params: { tenantId: string }): Promise<Invoice[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId: params.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return invoices.map(toDomainInvoice);
  }
}
