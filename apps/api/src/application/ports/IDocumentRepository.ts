import { Document } from "../../domain/entities/document.js";
import {
  DocumentExtraction,
  ExtractedInvoiceData,
} from "../../domain/entities/documentExtraction.js";
import { DocumentStatus } from "../../domain/enums/documentStatus.js";

export interface IDocumentRepository {
  create(params: {
    tenantId: string;
    uploadedBy: string;
    filename: string;
    content: string;
  }): Promise<Document>;

  findByIdForTenant(params: {
    tenantId: string;
    documentId: string;
  }): Promise<Document | null>;

  listForTenant(params: { tenantId: string }): Promise<Document[]>;

  updateStatus(params: {
    tenantId: string;
    documentId: string;
    status: DocumentStatus;
  }): Promise<Document>;

  createExtraction(params: {
    documentId: string;
    extractedJson: ExtractedInvoiceData;
    confidenceJson: Record<string, number>;
    validationErrors: string[] | null;
  }): Promise<DocumentExtraction>;
}
