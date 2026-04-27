import { DevLoginUseCase } from "../application/use-cases/auth/devLogin.useCase.js";
import { CreateDocumentUseCase } from "../application/use-cases/documents/createDocument.useCase.js";
import { GetDocumentUseCase } from "../application/use-cases/documents/getDocument.useCase.js";
import { ListDocumentsUseCase } from "../application/use-cases/documents/listDocuments.useCase.js";
import { GetInvoiceUseCase } from "../application/use-cases/invoices/getInvoice.useCase.js";
import { ListInvoicesUseCase } from "../application/use-cases/invoices/listInvoices.useCase.js";
import { JwtTokenService } from "./auth/jwtTokenService.js";
import { prisma } from "./persistence/prisma/prismaClient.js";
import { DocumentRepository } from "./persistence/repositories/documentRepository.js";
import { InvoiceRepository } from "./persistence/repositories/invoiceRepository.js";
import { MembershipRepository } from "./persistence/repositories/membershipRepository.js";
import { UserRepository } from "./persistence/repositories/userRepository.js";

const userRepository = new UserRepository(prisma);
const membershipRepository = new MembershipRepository(prisma);
const documentRepository = new DocumentRepository(prisma);
const invoiceRepository = new InvoiceRepository(prisma);

const tokenService = new JwtTokenService();

export const container = {
  tokenService,

  devLoginUseCase: new DevLoginUseCase(
    userRepository,
    membershipRepository,
    tokenService,
  ),

  createDocumentUseCase: new CreateDocumentUseCase(
    documentRepository,
    invoiceRepository,
  ),
  listDocumentsUseCase: new ListDocumentsUseCase(documentRepository),
  getDocumentUseCase: new GetDocumentUseCase(documentRepository),

  listInvoicesUseCase: new ListInvoicesUseCase(invoiceRepository),
  getInvoiceUseCase: new GetInvoiceUseCase(invoiceRepository),
};
