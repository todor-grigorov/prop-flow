import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/requirePermission.middleware.js";
import { container } from "../../container.js";

export const invoicesRouter = Router();

invoicesRouter.get(
  "/",
  authenticate,
  requirePermission("invoice:read"),
  async (req, res, next) => {
    try {
      const invoices = await container.listInvoicesUseCase.execute({
        context: req.context!,
      });

      res.status(200).json(invoices);
    } catch (error) {
      next(error);
    }
  },
);

invoicesRouter.get(
  "/:invoiceId",
  authenticate,
  requirePermission("invoice:read"),
  async (req, res, next) => {
    try {
      const invoice = await container.getInvoiceUseCase.execute({
        context: req.context!,
        invoiceId: req.params.invoiceId as string,
      });

      res.status(200).json(invoice);
    } catch (error) {
      next(error);
    }
  },
);
