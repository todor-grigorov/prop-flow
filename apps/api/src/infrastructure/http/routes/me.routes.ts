import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

export const meRouter = Router();

meRouter.get("/", authenticate, (req, res) => {
  res.status(200).json({
    userId: req.context!.userId,
    tenantId: req.context!.tenantId,
    role: req.context!.role,
  });
});
