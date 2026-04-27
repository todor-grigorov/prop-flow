import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/requirePermission.middleware.js";
import { container } from "../../container.js";

export const documentsRouter = Router();

const createDocumentSchema = z.object({
  filename: z.string().min(1),
  content: z.string().min(1),
});

documentsRouter.post(
  "/",
  authenticate,
  requirePermission("document:create"),
  async (req, res, next) => {
    try {
      const input = createDocumentSchema.parse(req.body);

      const document = await container.createDocumentUseCase.execute({
        context: req.context!,
        filename: input.filename,
        content: input.content,
      });

      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  },
);

documentsRouter.get(
  "/",
  authenticate,
  requirePermission("document:read"),
  async (req, res, next) => {
    try {
      const documents = await container.listDocumentsUseCase.execute({
        context: req.context!,
      });

      res.status(200).json(documents);
    } catch (error) {
      next(error);
    }
  },
);

documentsRouter.get(
  "/:documentId",
  authenticate,
  requirePermission("document:read"),
  async (req, res, next) => {
    try {
      const document = await container.getDocumentUseCase.execute({
        context: req.context!,
        documentId: req.params.documentId as string,
      });

      res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  },
);
