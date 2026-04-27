import { IDocumentRepository } from "../../../application/ports/IDocumentRepository.js";
import { Document } from "../../../domain/entities/document.js";
import {
  DocumentExtraction,
  ExtractedInvoiceData,
} from "../../../domain/entities/documentExtraction.js";
import { DocumentStatus } from "../../../domain/enums/documentStatus.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

export class DocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(params: {
    tenantId: string;
    uploadedBy: string;
    filename: string;
    content: string;
  }): Promise<Document> {
    return this.prisma.document.create({
      data: params,
    });
  }

  async findByIdForTenant(params: {
    tenantId: string;
    documentId: string;
  }): Promise<Document | null> {
    return this.prisma.document.findFirst({
      where: {
        id: params.documentId,
        tenantId: params.tenantId,
      },
    });
  }

  async listForTenant(params: { tenantId: string }): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: {
        tenantId: params.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateStatus(params: {
    tenantId: string;
    documentId: string;
    status: DocumentStatus;
  }): Promise<Document> {
    return this.prisma.document.update({
      where: {
        id: params.documentId,
        tenantId: params.tenantId,
      },
      data: {
        status: params.status,
      },
    });
  }

  async createExtraction(params: {
    documentId: string;
    extractedJson: ExtractedInvoiceData;
    confidenceJson: Record<string, number>;
    validationErrors: string[] | null;
  }): Promise<DocumentExtraction> {
    const extraction = await this.prisma.documentExtraction.create({
      data: {
        documentId: params.documentId,
        extractedJson: params.extractedJson,
        confidenceJson: params.confidenceJson,
        validationErrors: params.validationErrors ?? undefined,
      },
    });

    return {
      ...extraction,
      extractedJson: extraction.extractedJson as ExtractedInvoiceData,
      confidenceJson: extraction.confidenceJson as Record<string, number>,
      validationErrors: extraction.validationErrors as string[] | null,
    };
  }
}
