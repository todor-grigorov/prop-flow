import { IDocumentRepository } from "../../ports/IDocumentRepository.js";
import { IInvoiceRepository } from "../../ports/IInvoiceRepository.js";
import { RequestContext } from "../../dto/requestContext.js";
import { ForbiddenError } from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";
import { extractInvoiceDataFromText } from "../../services/documentExtractionService.js";
import { validateExtractedInvoiceData } from "../../services/invoiceValidationService.js";

export class CreateDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(input: {
    context: RequestContext;
    filename: string;
    content: string;
  }) {
    if (!can(input.context.role, "document:create")) {
      throw new ForbiddenError("Missing permission: document:create");
    }

    const document = await this.documentRepository.create({
      tenantId: input.context.tenantId,
      uploadedBy: input.context.userId,
      filename: input.filename,
      content: input.content,
    });

    await this.documentRepository.updateStatus({
      tenantId: input.context.tenantId,
      documentId: document.id,
      status: "PROCESSING",
    });

    const { extractedData, confidence } = extractInvoiceDataFromText(
      input.content,
    );

    const validationErrors = validateExtractedInvoiceData(extractedData);

    await this.documentRepository.createExtraction({
      documentId: document.id,
      extractedJson: extractedData,
      confidenceJson: confidence,
      validationErrors: validationErrors.length > 0 ? validationErrors : null,
    });

    if (validationErrors.length > 0) {
      return this.documentRepository.updateStatus({
        tenantId: input.context.tenantId,
        documentId: document.id,
        status: "VALIDATION_FAILED",
      });
    }

    await this.invoiceRepository.createDraft({
      tenantId: input.context.tenantId,
      documentId: document.id,
      invoiceNumber: extractedData.invoiceNumber!,
      supplierName: extractedData.supplierName!,
      invoiceDate: new Date(extractedData.invoiceDate!),
      currency: extractedData.currency!,
      grossAmount: extractedData.grossAmount!,
    });

    return this.documentRepository.updateStatus({
      tenantId: input.context.tenantId,
      documentId: document.id,
      status: "READY_FOR_REVIEW",
    });
  }
}
