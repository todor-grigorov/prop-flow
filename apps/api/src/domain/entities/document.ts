import { DocumentStatus } from "../enums/documentStatus.js";

export type Document = {
  id: string;
  tenantId: string;
  uploadedBy: string;
  filename: string;
  content: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
};
